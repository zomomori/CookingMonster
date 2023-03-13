import React from 'react';
import Select from 'react-select';
import './App.css';
import { useState, useEffect } from 'react';
const GPT3RecipeGeneratorDiet = require('./ModelAPI');

const diet_options = [
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Keto', label: 'Keto' },
  { value: 'Mediterranean', label: 'Mediterranean' },
  { value: 'Flexitarian', label: 'Flexitarian' },
  { value: 'Paleo', label: 'Paleo' },
  { value: 'Low carb', label: 'Low carb' }
];

const allergy_options = [
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Eggs', label: 'Eggs' },
  { value: 'Gluten', label: 'Gluten' },
  { value: 'Peanuts', label: 'Peanuts' },
  { value: 'Shellfish', label: 'Shellfish' },
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Soy', label: 'Soy' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Tree nuts ', label: 'Tree nuts' }
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: '16px',
    fontFamily: 'Sniglet',
    color: 'black',
    backgroundColor: '#f3e9e3'
  }),
  control: (provided, state) => ({
    ...provided,
    fontSize: 'Large',
    padding: '4px',
    fontFamily: 'Sniglet',
    borderRadius: '15px',
    border: '2px solid black',
    paddingLeft: '50px',
    backgroundColor: '#faf7f3'
  }),
};

// const new_fewshot_examples_restrictions = [
//   {
//     title: "No-Bake Nut Cookies",
//     ingredients: ["brown sugar", "milk", "vanilla", "nuts", "butter", "bite size shredded rice biscuits"],
//     directions: ["In a heavy 2-quart saucepan, mix brown sugar, nuts, evaporated milk and butter or margarine.", "Stir over medium heat until mixture bubbles all over top.", "Boil and stir 5 minutes more. Take off heat.", "Stir in vanilla and cereal; mix well.", "Using 2 teaspoons, drop and shape into 30 clusters on wax paper.", "Let stand until firm, about 30 minutes."],
//     diet_type: ["vegeterian"],
//     allergy_type: ["tree nuts", "dairy"],
//   },
//   {
//     title: "Jewell Ball'S Chicken",
//     ingredients: ["beef", "chicken breasts", "cream of mushroom soup", "sour cream"],
//     directions: ["Place chipped beef on bottom of baking dish.", "Place chicken on top of beef.", "Mix soup and cream together; pour over chicken. Bake, uncovered, at 275\\u00b0 for 3 hours."],
//     diet_type: null,
//     allergy_type: null,
//   },
//   {
//     title: "Creamy Corn",
//     ingredients: ["frozen corn", "cream cheese", "butter", "garlic powder", "salt", "pepper"],
//     directions: ["In a slow cooker, combine all ingredients. Cover and cook on low for 4 hours or until heated through and cheese is melted. Stir well before serving. Yields 6 servings."],
//     diet_type: ["vegetarian"],
//     allergy_type: null,
//   },
//   {
//     title: "Chicken Funny",
//     ingredients: ["chicken", "chicken gravy", "cream of mushroom soup", "shredded cheese"],
//     directions: ["Boil and debone chicken.", "Put bite size pieces in average size square casserole dish.", "Pour gravy and cream of mushroom soup over chicken; level.", "Make stuffing according to instructions on box (do not make too moist).", "Put stuffing on top of chicken and gravy; level.", "Sprinkle shredded cheese on top and bake at 350\\u00b0 for approximately 20 minutes or until golden and bubbly."],
//     diet_type: null,
//     allergy_type: null,
//   },
//   {
//     title: "Reeses Cups(Candy)  ",
//     ingredients: ["peanut butter", "graham cracker crumbs", "butter", "powdered sugar", "chocolate chips"],
//     directions: ["Combine first four ingredients and press in 13 x 9-inch ungreased pan.", "Melt chocolate chips and spread over mixture. Refrigerate for about 20 minutes and cut into pieces before chocolate gets hard.", "Keep in refrigerator."],
//     diet_type: ["vegetarian"],
//     allergy_type: ["peanuts", "dairy"],
//   },
// ];

function App() {
  const [toGenerate, setToGenerate] = useState(true);
  const [dietOptions, setDietOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);

  async function init() {
    const m = new GPT3RecipeGeneratorDiet();
    // m.fine_tune(new_fewshot_examples_restrictions);
    setModel(m);
  }

  useEffect(() => {
    init();
  }, []);

  const handleDietChange = (selectedOptions) => {
    setDietOptions(selectedOptions);
  };

  const handleAllergyChange = (selectedOptions) => {
    setAllergyOptions(selectedOptions);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleGenerateButtonClick = async () => {
    if (toGenerate) {
        const dietValues = dietOptions.map(option => option.value).join(", ");
        const allergyValues = allergyOptions.map(option => option.value).join(", ");
        if (inputText.length === 0) {
          alert('Ingredients cannot be empty!');
          return;
        }
        setIsLoading(true);
        const result = await model.generate_recipe(inputText, dietValues, allergyValues);
        setOutputText(result);
        setIsLoading(false);
    }
    else {
      setDietOptions([]);
      setAllergyOptions([]);
      setInputText('');
      setOutputText('');
    }
    setToGenerate(!toGenerate);
  };


  return (
    <div className='App-header'>
        <div className='Main-body'>
            {toGenerate ? 
                  (<input type='text' placeholder='Enter ingredients and other instructions...' 
                   onChange={handleInputChange} value={inputText} />) : null}
            {toGenerate ? 
                  (<Select options={diet_options} isMulti={true} placeholder='Diet preferences...' 
                  className='Preferences' styles={customStyles} menuPlacement='auto' 
                  menuPosition='center' onChange={handleDietChange}/>) : null}
            {toGenerate ?
                  (<Select options={allergy_options} isMulti={true} placeholder='Allergies...' 
                  className='Preferences' styles={customStyles} menuPlacement='auto' 
                  menuPosition='center' onChange={handleAllergyChange}/>) : null}
            {toGenerate ? 
                null : (<div className='Output-Text'>{outputText}</div>)}
            <button className="Generate-button" onClick={handleGenerateButtonClick}>
                {isLoading ? 'Generating' : (toGenerate ? 'Generate' : 'Generate again') }
            </button>
        </div>
    </div>
  );
}

export default App;