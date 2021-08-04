This is a simple python-based POC to test simple drawings. It uses the pycairo library for drawings. Follow instructions below to setup.

# Installation

Python virtual environments are used to manage dependencies without impacting your
other projects.

After cloning the project and moving to its folder :

1. Fetch virtualenv via pip if it is not already installed.

    ```
    pip install virtualenv
    ```

2. Create a virtualenv `venv` using python 3 in the project folder.

    ```
    virtualenv -p /usr/bin/python3 venv
    ```

3. Activate `venv`.

    ```
    source venv/bin/activate
    ```

4. Install all requirements in `venv`.

    ```
    pip install -r requirements.txt
    ```

You are now ready to use the program. First customize the `config.json` file and then launch the command:

```
python3 main.py ./config.json
```

Output will be written to `cool_picture.svg`.
