//tile based adaptation
static void dash_global_rate_adaptation(GF_DashClient *dash, Bool for_postponed_only)
{
	u32 quality_rank;
	u32 min_bandwidth = 0;
	Bool force_rep_idx = GF_FALSE;
	Bool local_file_mode = GF_FALSE;
	GF_MPD_Representation *rep, *rep_new;
	u32 total_rate, bandwidths[20], groups_per_quality[20], max_level;
	u32 q_idx, nb_qualities = 0;
	u32 i, count = gf_list_count(dash->groups), local_files = 0;

	//initialize min/max bandwidth
	min_bandwidth = 0;
	max_level = 0;
	total_rate = (u32) -1;
	nb_qualities = 1;

	//get max qualities due to SRD descriptions
	//for now, consider all non-SRDs group to run in max quality
	for (i=0; i<gf_list_count(dash->SRDs); i++) {
		struct _dash_srd_desc *srd = gf_list_get(dash->SRDs, i);
		u32 nb_q = MAX(srd->srd_nb_cols, srd->srd_nb_rows);
		if (nb_q > nb_qualities) nb_qualities = nb_q;
	}

	//estimate bitrate
	for (i=0; i<count; i++) {
		GF_DASH_Group *group = gf_list_get(dash->groups, i);
		if (group->selection != GF_DASH_GROUP_SELECTED) continue;
		if (group->local_files) local_files ++;
		if (!group->bytes_per_sec) continue;

		//only count broadband ones
		if (dash->atsc_clock_state && !gf_list_count(group->period->base_URLs) && !gf_list_count(group->adaptation_set->base_URLs)) {
			u32 j;
			//get all active rep, count bandwidth for broadband ones
			for (j=0; j<=group->max_complementary_rep_index; j++) {
				rep = gf_list_get(group->adaptation_set->representations, j);
				//this rep is not in broadcast, add bandwidth
				if (gf_list_count(rep->base_URLs)) {
					total_rate = group->bytes_per_sec;
				}
			}
		} else {
			//keep min rate to perform rate adaptation
			if (total_rate > group->bytes_per_sec)
				total_rate = group->bytes_per_sec;
		}
	}
	if (total_rate == (u32) -1) {
		total_rate = 0;
	}
	if (local_files==count) {
		total_rate = dash->dash_io->get_bytes_per_sec(dash->dash_io, NULL);
		if (!total_rate) local_file_mode = GF_TRUE;
	} else if (!total_rate) {
		return;
	}

  for (q_idx=0; q_idx<nb_qualities; q_idx++) {
		bandwidths[q_idx] = 0;
		groups_per_quality[q_idx] = 0;

		for (i=0; i<count; i++) {
			GF_DASH_Group *group = gf_list_get(dash->groups, i);
			if (group->selection != GF_DASH_GROUP_SELECTED) continue;

			quality_rank = gf_dash_get_tiles_quality_rank(dash, group);
			if (quality_rank >= nb_qualities) quality_rank = nb_qualities-1;
			if (quality_rank != q_idx) continue;

			group->target_new_rep = 0;
			rep = gf_list_get(group->adaptation_set->representations, group->target_new_rep);
			bandwidths[q_idx] += rep->bandwidth;
			groups_per_quality[q_idx] ++;
			if (max_level < 1 + quality_rank) max_level = 1+quality_rank;

			//quick trick here: if no download cap in local playback, compute the total rate based on
			//quality rank
			if (local_file_mode) {
				u32 nb_reps = gf_list_count(group->adaptation_set->representations);
				//get rep matching the given quality rank - quality 0 is the highest and our
				//reps are sorted from lowest !
				u32 rep_target;
				if (!quality_rank)
					rep_target = nb_reps-1;
				else
					rep_target = (nb_qualities - quality_rank) * nb_reps / nb_qualities;

				rep = gf_list_get(group->adaptation_set->representations, rep_target);
				total_rate += rep->bandwidth;
			}
		}
		min_bandwidth += bandwidths[q_idx];
	}
	if (local_file_mode) {
		//total rate is in bytes per second, and add a safety of 10 bytes to ensure selection
		total_rate = 10 + total_rate / 8;
	}

	/*no per-quality adaptation, we may have oscillations*/
	if (!dash->tile_rate_decrease) {
	}
	/*automatic rate alloc*/
	else if (dash->tile_rate_decrease==100) {
		//for each quality level (starting from highest priority), increase the bitrate if possible
		for (q_idx=0; q_idx < max_level; q_idx++) {
			Bool test_pass = GF_TRUE;
			while (1) {
				u32 nb_rep_increased = 0;
				u32 nb_rep_in_qidx = 0;
				u32 cumulated_bw_in_pass = 0;

				for (i=0; i<count; i++) {
					u32 diff;
					GF_DASH_Group *group = gf_list_get(dash->groups, i);
					if (group->selection != GF_DASH_GROUP_SELECTED) continue;

					quality_rank = gf_dash_get_tiles_quality_rank(dash, group);
					if (quality_rank >= nb_qualities) quality_rank = nb_qualities-1;
					if (quality_rank != q_idx) continue;

					if (group->target_new_rep + 1 == gf_list_count(group->adaptation_set->representations))
						continue;

					nb_rep_in_qidx++;

					rep = gf_list_get(group->adaptation_set->representations, group->target_new_rep);
					diff = rep->bandwidth;
					rep_new = gf_list_get(group->adaptation_set->representations, group->target_new_rep+1);
					diff = rep_new->bandwidth - diff;

					if (dash->atsc_clock_state) {
						//if baseURL in period or adaptation set, we assume we are in broadband mode, otherwise we re in broadcast, don't count bitrate
						if (!gf_list_count(group->period->base_URLs) && !gf_list_count(group->adaptation_set->base_URLs)) {
							//new rep is in broadcast, force diff to 0 to select the rep
							if (!gf_list_count(rep_new->base_URLs)) {
								diff = 0;
							}
							//new rep is in broadband, prev rep is in broadcast, diff is the new rep bandwidth
							else if (!gf_list_count(rep->base_URLs)) {
								diff = rep_new->bandwidth;
							}
						}
					}

					if (test_pass) {
						cumulated_bw_in_pass+= diff;
						nb_rep_increased ++;
					} else if (min_bandwidth + diff < 8*total_rate) {
						min_bandwidth += diff;
						nb_rep_increased ++;
						bandwidths[q_idx] += diff;
						group->target_new_rep++;
					}
				}
				if (test_pass) {
					//all reps cannot be switched up in this quality level, do it
					if ( min_bandwidth + cumulated_bw_in_pass > 8*total_rate) {
						break;
					}
				}
				//no more adjustement possible for this quality level
				if (! nb_rep_increased)
					break;

				test_pass = !test_pass;
			}
		}

		if (! for_postponed_only) {
			GF_LOG(GF_LOG_DEBUG, GF_LOG_DASH, ("[DASH] Rate Adaptation - download rate %d kbps - %d quality levels (cumulated representations rate %d kbps)\n", 8*total_rate/1000, max_level, min_bandwidth/1000));

			for (q_idx=0; q_idx<max_level; q_idx++) {
				GF_LOG(GF_LOG_DEBUG, GF_LOG_DASH, ("[DASH]\tLevel #%d - %d Adaptation Sets for a total %d kbps allocated\n", q_idx+1, groups_per_quality[q_idx], bandwidths[q_idx]/1000 ));
			}
		}

		force_rep_idx = GF_TRUE;
	}
	/*for each quality level get tile_rate_decrease% of the available bandwidth*/
	else {
		u32 rate = bandwidths[0] = total_rate * dash->tile_rate_decrease / 100;
		for (i=1; i<max_level; i++) {
			u32 remain = total_rate - rate;
			if (i+1==max_level) {
				bandwidths[i] = remain;
			} else {
				bandwidths[i] = remain * dash->tile_rate_decrease/100;
				rate += bandwidths[i];
			}
		}

		if (! for_postponed_only) {
			GF_LOG(GF_LOG_INFO, GF_LOG_DASH, ("[DASH] Rate Adaptation - download rate %d kbps - %d quality levels (cumulated rate %d kbps)\n", 8*total_rate/1000, max_level, 8*min_bandwidth/1000));
			for (q_idx=0; q_idx<max_level; q_idx++) {
				GF_LOG(GF_LOG_INFO, GF_LOG_DASH, ("[DASH]\tLevel #%d - %d Adaptation Sets for a total %d kbps allocated\n", q_idx+1, groups_per_quality[q_idx], 8*bandwidths[q_idx]/1000 ));
			}
		}
	}

	//GF_LOG(GF_LOG_DEBUG, GF_LOG_DASH, ("DEBUG. 2. dowload at %d \n", 8*bandwidths[q_idx]/1000));
	//bandwitdh sharing done, perform rate adaptation with theses new numbers
	for (i=0; i<count; i++) {
		GF_DASH_Group *group = gf_list_get(dash->groups, i);
		if (group->selection != GF_DASH_GROUP_SELECTED) continue;

		if (force_rep_idx) {
			rep = gf_list_get(group->adaptation_set->representations, group->target_new_rep);
			//add 100 bytes/sec to make sure we select the target one
			group->bytes_per_sec = 100 + rep->bandwidth / 8;
		}
		//decrease by quality level
		else if (dash->tile_rate_decrease) {
			quality_rank = gf_dash_get_tiles_quality_rank(dash, group);
			if (quality_rank >= nb_qualities) quality_rank = nb_qualities-1;
			assert(groups_per_quality[quality_rank]);
			group->bytes_per_sec = bandwidths[quality_rank] / groups_per_quality[quality_rank];
		}

		if (for_postponed_only) {
			if (group->rate_adaptation_postponed)
				dash_do_rate_adaptation(dash, group, i);
		} else {
			dash_do_rate_adaptation(dash, group, i);

			if (!group->rate_adaptation_postponed)
				group->bytes_per_sec = 0;
		}
	}
}
