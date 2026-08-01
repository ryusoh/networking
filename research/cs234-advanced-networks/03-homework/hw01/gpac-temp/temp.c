/* This function is called each time a new segment has been downloaded */
static void dash_do_rate_adaptation(GF_DashClient *dash, GF_DASH_Group *group, int adaptation_set_num)
{
	Double speed;
	Double max_available_speed;
	u32 dl_rate;
	u32 k;
	s32 new_index, old_index;
	GF_DASH_Group *base_group;
	GF_MPD_Representation *rep;
	GF_MPD_Representation *new_rep;
	Bool force_lower_complexity;

	/* Don't do adaptation if configured switching to happen systematically (debug) */
	if (dash->auto_switch_count) {
		return;
	}
	/* Don't do adaptation if GPAC config disabled switching */
	if (group->dash->disable_switching) {
		return;
	}

	/* The bytes_per_sec field is set each time a segment is downloaded,
	   (this may need to be adjusted in the future to accomodate algorithms
	   that smooth download rate over several segments)
	   if set to 0, this means that no segment was downloaded since the last call
	   because this AdaptationSet is not selected
	   So no rate adaptation should be done*/
	if (!group->bytes_per_sec) {
		return;
	}
	
	/* Find the AdaptationSet on which this AdaptationSet depends, if any
	   (e.g. used for specific coding schemes: scalable streams, tiled streams, ...)*/
	base_group = group;
	while (base_group->depend_on_group) {
		base_group = base_group->depend_on_group;
	}

	/* adjust the download rate according to the playback speed
	   All adaptation algorithms should use this value */
	speed = dash->speed;
	if (speed<0) speed = -speed;
	dl_rate = (u32)  (8*group->bytes_per_sec / speed);

	/* Get the active representation in the AdaptationSet */
	rep = gf_list_get(group->adaptation_set->representations, group->active_rep_index);

	/*check whether we can play with this speed (i.e. achieve target frame rate);
	if not force, let algorithm know that they should switch to a lower resolution*/
	max_available_speed = gf_dash_get_max_available_speed(dash, base_group, rep);
	if (!dash->disable_speed_adaptation && !rep->playback.waiting_codec_reset) {
		if (max_available_speed && (speed > max_available_speed)) {
			GF_LOG(GF_LOG_INFO, GF_LOG_DASH, ("[DASH] Forcing a lower complexity to achieve desired playback speed"));
			force_lower_complexity = GF_TRUE;
		}
		else {
			force_lower_complexity = GF_FALSE;
		}
	}
	else {
		force_lower_complexity = GF_FALSE;
	}

	/*query codec and buffer statistics for buffer-based algorithms */
	group->buffer_max_ms = 0;
	group->buffer_occupancy_ms = 0;
	group->codec_reset = 0;
	/* the DASH Client asks the player for its buffer level
	  (uses a function pointer to avoid depenencies on the player code, to reuse the DASH client in different situations)*/
	dash->dash_io->on_dash_event(dash->dash_io, GF_DASH_EVENT_CODEC_STAT_QUERY, gf_list_find(group->dash->groups, group), GF_OK);

	//adjust buffer with current segments not yet consumed by player
	for (k=0; k<group->nb_cached_segments; k++) {
		group->buffer_occupancy_ms += group->cached[k].duration;
	}
	

	/* If the playback for the current representation was waiting for a codec reset and it happened,
	   indicate that this representation does not need a reset anymore */
	if (rep->playback.waiting_codec_reset && group->codec_reset) {
		rep->playback.waiting_codec_reset = GF_FALSE;
	}

	old_index = group->active_rep_index;
	//scalable case, force the rate algo to consider the active rep is the max rep
	if (group->base_rep_index_plus_one) {
		group->active_rep_index = group->max_complementary_rep_index;
	}
	if (group->dash->atsc_clock_state) {
		rep = gf_list_get(group->adaptation_set->representations, group->active_rep_index);
		if (rep->playback.broadcast_flag && (dl_rate < rep->bandwidth)) {
			dl_rate = rep->bandwidth+1;
			GF_LOG(GF_LOG_DEBUG, GF_LOG_DASH, ("[DASH] AS#%d representation %d segment sent over broadcast, forcing bandwidth to %d\n", 1 + gf_list_find(group->period->adaptation_sets, group->adaptation_set), group->active_rep_index, dl_rate));
		}
	}


	// ================================[nmsl_TODO_&_HINT]==================================

	// - task 1: Unblock this line to print out "model".
	//   printf("adaptation_set_num: %d, model: %d\n", adaptation_set_num, group->adaptation_set->model);

	// - task 2: Assign new value to new_index to accomplish task 2. Try to figure out how GPAC 
	//   assigns representation index to each tile, you will have to answer it in your report.
	   new_index = 0;
	// ====================================================================================


	
	
	if (dash->rate_adaptation_algo) {
		new_index = dash->rate_adaptation_algo(dash, group, base_group,
														  dl_rate, speed, max_available_speed, force_lower_complexity,
														  rep, GF_FALSE);
	}

	if (new_index==-1) {
		group->active_rep_index = old_index;
		group->rate_adaptation_postponed = GF_TRUE;
		return;
	}
	group->rate_adaptation_postponed = GF_FALSE;

	if (new_index != group->active_rep_index) {
		new_rep = gf_list_get(group->adaptation_set->representations, (u32)new_index);
		if (!new_rep) {
			GF_LOG(GF_LOG_ERROR, GF_LOG_DASH, ("[DASH] Error: Cannot find new representation index %d\n", new_index));
			return;
		}

		GF_LOG(GF_LOG_DEBUG, GF_LOG_DASH, ("[DASH] AS#%d switching after playing %d segments, from rep %d to rep %d\n", 1 + gf_list_find(group->period->adaptation_sets, group->adaptation_set),
				group->nb_segments_since_switch, group->active_rep_index, new_index));
		group->nb_segments_since_switch = 0;

		if (force_lower_complexity) {
			GF_LOG(GF_LOG_INFO, GF_LOG_DASH, ("[DASH] Requesting codec reset\n"));
			new_rep->playback.waiting_codec_reset = GF_TRUE;
		}
		/* request downloads for the new representation */
		gf_dash_set_group_representation(group, new_rep);

		/* Reset smoothing of switches
		(note: should really apply only to algorithms using the switch_probe_count (smoothing the aggressiveness of the change)
		for now: only GF_DASH_ALGO_GPAC_LEGACY_RATE and  GF_DASH_ALGO_GPAC_LEGACY_BUFFER */
		for (k = 0; k < gf_list_count(group->adaptation_set->representations); k++) {
			GF_MPD_Representation *arep = gf_list_get(group->adaptation_set->representations, k);
			if (new_rep == arep) continue;
			arep->playback.probe_switch_count = 0;
		}

	} else {
		group->active_rep_index = old_index;
		if (force_lower_complexity) {
			GF_LOG(GF_LOG_WARNING, GF_LOG_DASH, ("[DASH] Speed %f is too fast to play - speed down\n", dash->speed));
			/*FIXME: should do something here*/
		}
	}

	/* Remembering the buffer level for the processing of the next segment */
	group->buffer_occupancy_at_last_seg = group->buffer_occupancy_ms;
}
  
