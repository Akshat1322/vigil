@echo off
echo Resetting baselines...
uv run python -m harness.runner --reset-baselines
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo Running suite first time...
uv run python -m harness.runner
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo Running suite second time...
uv run python -m harness.runner > run2.txt
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo Done.
