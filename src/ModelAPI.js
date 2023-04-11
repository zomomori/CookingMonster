const { Configuration, OpenAIApi } = require('openai');
const apikey = process.env['GPT_KEY'];
const configuration = new Configuration({ apiKey: apikey });
const openai = new OpenAIApi(configuration);

class GPT3RecipeGeneratorDiet {
	constructor(api_key = process.env['GPT_KEY'], model_engine = "text-davinci-003") {
		this.api_key = api_key;
		this.model_engine = model_engine;
		openai.apiKey = api_key;
	}

	async generate_recipe(ingredients, diet_type = null, allergy_type = null) {
		let prompt = `Generate a recipe that only contains ${ingredients}`;
		if (diet_type) {
			prompt += ` and is suitable for ${diet_type} diet`;
		}
		if (allergy_type) {
			prompt += ` and is free of ${allergy_type} allergens`;
		}
		prompt += ":";
		try {
			const response = await openai.createCompletion({
				model: this.model_engine,
				prompt: prompt,
				temperature: 0.7,
				max_tokens: 2048,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0.8, // penalize recipe with ingredients not exist in the prompt
			});
			const recipe = response.data.choices[0].text.trim();
			return recipe;
		} catch (error) {
			return `Error: ${error.message}`;
		}
	}

	async fine_tune(fewshot_examples) {
		const examples = [];
		for (const example of fewshot_examples) {
			let prompt = `Recipe: ${example.title}\nIngredients: ${example.ingredients.join(', ')}\n`;
			if (example.diet_type) {
				prompt += `Diet Type: ${example.diet_type.join(", ")}\n`;
			}
			if (example.allergy_type) {
				prompt += `Allergy Type: ${example.allergy_type.join(", ")}\n`;
			}
			prompt += `Directions: ${example.directions.join(", ")}\n\n`;
			examples.push(prompt);
		}
		try {
			await openai.createCompletion({
				model: this.model_engine,
				prompt: examples,
				temperature: 0.5,
				max_tokens: 1024,
				n: 1,
				stop: null,
				presence_penalty: 0.8
			});
		} catch (error) {
			alert(`Error during few-shot prompting: ${error.message}`);
		}

	}
}

module.exports = GPT3RecipeGeneratorDiet;