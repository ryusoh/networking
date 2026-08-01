# CMake projet of OpenSVCDecoder
cmake_minimum_required (VERSION 2.6)
project (OpenSVCDecoder)

# Add libraries
add_subdirectory(AVC/h264_baseline_decoder/lib_baseline)
add_subdirectory(AVC/h264_main_decoder/lib_main)
add_subdirectory(CommonFiles/src)
add_subdirectory(SVC/lib_svc)

# Include directories
include_directories(AVC/h264_baseline_decoder/lib_baseline AVC/h264_main_decoder/lib_main CommonFiles/src SVC/lib_svc )


