# Distributed domino game

Implementation of a domino game using Python, JavaScript and WebSockets for UTP course IS893. There are two parts of the system, the client and the server, which are written in Javascript and Python respectively.

## Running the server

Right now you must install the Python dependencies globally :cry: via [pip](https://pip.pypa.io/en/stable/installing/). For this you execute

```bash
  pip install socketio eventlet flask
```

(You should have root permission, e.g. in UNIX-like use `sudo -H pip ...`)

And to run the server, simply do `python main.py` inside the `server` directory.

## Running the client

You must have node.js and npm in your machine, if you don't have them already follow [these instructions](https://nodejs.org/en/download/package-manager/).

Then in a terminal, navigate to the `client` folder and run `npm install` to download all dependencies. To start it, run `node server.js` and the client will be available at `http://localhost:8080/` in your browser.

Something important is that you must specify the server's IP (port is 9000) inside the `client/public/js/connection.js` file in the `socketServer` const in line 3. By default this is `localhost`.

Now you can play :trophy:
