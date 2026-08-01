@echo off
set OLDDIR=%CD%
cd /d %~dp0

:openhevc
set GIT=
for %%e in (%PATHEXT%) do (
  for %%X in (git%%e) do (
    if not defined GIT (
      set GIT=%%~$PATH:X
    )
  )
)

if not defined GIT goto git_not_found


IF EXIST ./openHEVC/ goto update_openhevc
git clone https://github.com/OpenHEVC/openHEVC.git
cd openHEVC
"%GIT%" checkout hevc_rext
cd ..
goto copy_openhevc

:update_openhevc
cd openHEVC
"%GIT%" checkout hevc_rext
"%GIT%" pull
cd ..
goto copy_openhevc

:git_not_found
echo "Git has not been found on your system, openhevc will not be enable"

:copy_openhevc
copy openHEVC\bin\ffmpeg_w32\libLibOpenHevcWrapper.dll lib\win32\debug\
copy openHEVC\bin\ffmpeg_w32\libLibOpenHevcWrapper.dll lib\win32\release\
copy openHEVC\bin\ffmpeg_w64\libLibOpenHevcWrapper.dll lib\x64\debug\
copy openHEVC\bin\ffmpeg_w64\libLibOpenHevcWrapper.dll lib\x64\release\

cd /d %OLDDIR%
