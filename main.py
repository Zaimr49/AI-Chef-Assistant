import os
from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import re
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for all routes


# app = Flask(__name__)

MODEL_ID = "mzman123/musa-chef-gpt"
tokenizer = AutoTokenizer.from_pretrained("auhide/chef-gpt-en")
chef_gpt = AutoModelForCausalLM.from_pretrained(MODEL_ID)
print("Model Loaded")


@app.route("/")
def home():
    return "Hello World"


# @app.route("/generate", methods=['POST'])
@app.route("/generate", methods=['POST'])
def generate_from_model():
    data = request.get_json()  # Getting JSON data from POST request
    ingredients = data.get('ingredients')  # Extract ingredients list from data
    ingredients = ingredients.split(', ')

    print("at backend",ingredients)
    if isinstance(ingredients, list):  # Check if ingredients is a list
        prompt_text = f"ingredients>> {', '.join(ingredients)} ; recipe>>"
        prompt_tokens = tokenizer(prompt_text, return_tensors="pt")
        print("Prompt = ", prompt_text)
        
        output_test = chef_gpt.generate(
            prompt_tokens.input_ids, 
            do_sample=True, 
            max_length=1000, 
            top_p=0.95,
            attention_mask=prompt_tokens.attention_mask)

        recipe = tokenizer.batch_decode(output_test)[0]
        print("Recipe before regex = ", recipe)
        pattern = r"recipe>>([\s\S]*?)"  # This might need adjusting

        match = re.search(pattern, recipe)
        if match:
            recipe = recipe[match.end():].strip()
        else:
            print("Recipe section not found.")

        
        unwanted_phrases = ['<|endoftext|>', '']
        for phrase in unwanted_phrases:
            recipe = recipe.replace(phrase, '')

        recipe = recipe.split('\n')
        response = jsonify(recipe)  # Return recipe as JSON
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response
    else:
        return jsonify({"error": "Input data should be an array of strings"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=3000))