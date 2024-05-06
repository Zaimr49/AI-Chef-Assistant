---
title: AI Chef Assistant
description: A dynamic Flask application designed to assist chefs with AI-powered recipes and kitchen management tools.
tags:
  - python
  - flask
  - AI
  - cooking
---

# 🍳 AI Chef Assistant

Welcome to the AI Chef Assistant, a Flask-powered application that leverages artificial intelligence to revolutionize the cooking experience. Whether you're a professional chef or a cooking enthusiast, this app provides personalized recipe suggestions, ingredient management, and culinary techniques to elevate your kitchen game.

## ✨ Features

- 🤖 **AI-Powered & Personalized Recipe Suggestions**: Get recommendations and discover new recipes tailored to your ingredients. 🥗
- 📚 **Comprehensive Ingredient Database**: Explore a vast database of ingredients with multiple recipes.
- 🍽️ **Cooking Techniques**: Learn various cooking methods directly through the app with step-by-step guides.
- 🖼️ **Dynamic Step-by-Step Visual Guides**: Utilizing a state-of-the-art diffusion model, our app generates custom images for each step of the recipe, making it easier to follow along and ensuring a delightful cooking experience.


## 💁‍♀️ How to Use

1. **Setup the Environment**:
   - Ensure Python is installed on your machine.
   - Install the required Python packages:
     ```
     pip install -r requirements.txt
     ```

2. **Start the Server**:
   - Launch the application for development or production:
     ```
     python3 main.py
     ```

3. ## 🌐 Access the API

- **Testing the API**: To start interacting with the AI Chef Assistant API, open your preferred API tester (like Postman or Thunder Client).
  - Navigate to `http://localhost:5000` to send requests and receive responses from the API. This base URL serves as the entry point for accessing the different functionalities provided by the AI Chef Assistant.
## 📝 Usage

### Generating a Recipe with `http://localhost:5000/generate`
This endpoint allows you to generate cooking recipes based on the ingredients you provide.

- **Endpoint**: `/generate`
- **Method**: POST
- **Content-Type**: `application/json`
- **Body**: Include a JSON object with an "ingredients" key, listing ingredients separated by commas.
  
  Example request body:
  ```json
  {
    "ingredients": "tomatoes, onions, garlic"
  }

📖 Project Structure
   - main.py: The entry point of the Flask application.
   - requirements.txt: A file containing all necessary Python packages.


## 🛠️ Development

- **Python**: 3.8+
- **Framework**: Flask 1.1.x
- **Dependencies**: Listed in `requirements.txt`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy Cooking! 🌟
