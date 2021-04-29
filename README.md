# DEV BOON
## _A VS CODE QUERY ENGINE_


DevBoon is a Visual Studio Code extension, that provides a query engine to help python and java developers so as to decrease their development time and increase their productivity. 

> Visit Our Website  https://chirag2706.github.io/  for documentation, installation , demonstration and complete project overview.

## Features

The current version has four queries namely 
- "Search Query"
- "Error Query" 
- "Snippet Query"
- "Completion Query" 
along with a Developer Activity Tracker,  "Difficulty Recognizer".


## Uses of Dev Boon
>Users Can search for their Query directly on our extension’s search box by pressing “Ctrl+Shift+Q”. Then user will be given an option to choose (Either StackOverFlow or YouTube) .
>Users can also search for the query selected (hovered) on the editor by pressing “Ctrl+Shift+S” for StackOverFlow posts or “Ctrl+Shift+Y” for YouTube videos.

>Whenever User encounters an error ( compilation error , runtime error etc ) while executing a program , we will automatically detect that and we will show the relevant StackOverFlow posts and YouTube Videos.

>Whenever User wants a piece of code for some task , User can simply Write an ‘English’ sentence enclosed in between “?” and “?” and press “Ctrl+Shift+N”. We will automatically paste the relevant code snippet from StackOverFlow in the Editor where the cursor is currently positioned ( along with the link for that code as comment ). We will automatically detect the programming language and paste the relevant code.

>This extension can also be used by python and java developers inorder to complete incomplete code snippets or incomplete functions by pressing “Ctrl+Shift+W”.

> Users activity is also tracked ( Based on number add , delete , click and various other events) and we will give messages to user if he is struck in the development.


## Installation
Inorder to get started with Dev Boon extension,clone git repository of dev-boon extension by executing command:
```sh
git clone https://github.com/chirag2706/dev-boon
```
Navigate inside the dev-boon directory.
Now execute the following commands to install all necessary npm and python packages in your computer.
```sh
cd dev-boon
npm install
pip3 install -r requirements.txt
```
Next, Run the extension either with 'Code-Insiders' or by Pressing 'F5(Fn+F5)' key inside the VS-CODE.
After extension starts running , execute the command
```sh
python3 ./src/backend/main.py
```
The setup is complete.

## Technologies

Dev Boon uses a number of Technologies to work

- JavaScript
- TypeScript
- HTML,CSS
- Python3
- Flask
- Machine Learning
- Deep Learning
- Mongo DB


And "DEV BOON" is Open Source on GitHub.

## Running and Testing the Features
> Visit Our Website  https://chirag2706.github.io/  to see how to run our Extensions features.
