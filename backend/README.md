# Setup
To configure this project, follow the steps below:

1. **Use Python >= 3.10 and WSL:**
   Make sure you have Python installed, preferably version 3.10 or higher. You can check your Python version with:

python --version


2. **Create a virtual environment:**

python -m venv dataminder


3. **Activate the virtual environment:**

source dataminder/bin/activate


4. **Install dependencies:**
Ensure you have a `requirements.txt` file with the necessary dependencies. Then run:

pip install -r requirements.txt


5. **Run the server:**
To start the server, execute:

uvicorn main:app --reload