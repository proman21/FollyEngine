@rem : Run from project root directory.
@rem : Refresh frontend.
cd frontend
call npm run build
cd ..\backend
rem : Run the application (start =: async simulation
rem : Note that 'call' also works and doesn't open a new cmd window, but the batch commands below won't get called before the python process is terminated.
start python run.py
@rem : Return to project root directory.
cd ..\
