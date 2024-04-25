import os
from flask import Flask, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import re

app = Flask(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_ID = "ModelSave"
tokenizer = AutoTokenizer.from_pretrained("auhide/chef-gpt-en")
chef_gpt = AutoModelForCausalLM.from_pretrained(MODEL_ID)
chef_gpt.to(device)
print("Model Loaded")


@app.route("/")
def home():
    return "Hello World"


@app.route("/generate", methods=['POST'])
def generate_from_model():
    data = request.get_json()  # Getting JSON data from POST request
    if isinstance(data, list):
        # Assuming your model generates responses based on input strings
        # Here, I'm just returning the input strings as is for demonstration
        prompt_tokens = tokenizer(f"ingredients>> {','.join(data)} ; recipe>>",return_tensors="pt")
        print("Prompt = ",f"ingredients>> {','.join(data)} ; recipe>>")
        prompt_tokens.to(device)
        output_test = chef_gpt.generate(
                prompt_tokens.input_ids, 
                do_sample=True, 
                max_length=1000, 
                top_p=0.95,
                attention_mask=prompt_tokens.attention_mask)

        recipe = tokenizer.batch_decode(output_test)[0]
        recipe = recipe.replace("<|endoftext|>", "")
        print("recipe before regex = ",recipe)
        pattern = r"recipe>>([\s\S]*?)"

        match = re.search(pattern, recipe)

        if match:
            recipe = recipe[match.end():].strip()
        else:
            print("Recipe section not found.")

        recipe = recipe.split('\n')

        return recipe
    else:
        return jsonify({"error": "Input data should be an array of strings"}), 400


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))