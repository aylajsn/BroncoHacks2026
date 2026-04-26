const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function identifyClothing(imagePath) {
    try {
        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // Determine the media type
        const ext = path.extname(imagePath).toLowerCase();
        const mediaTypeMap = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        };
        const mimeType = mediaTypeMap[ext] || 'image/jpeg';

        // Initialize the model
        const model = client.getGenerativeModel({ model: 'gemma-4-31b-it' });

        // Send request to Gemini API
        const response = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            },
            'Identify all clothing items visible in this image. For each item, provide: 1) The type of clothing, 2) Color, 3) Style/Pattern, 4) Condition. Format as a structured list.'
        ]);
        const result = response.response.candidates[0].content.parts[0].text;
        return result;
    } catch (error) {
        console.error('Error identifying clothing:', error);
        throw error;
    }
}

// Main execution
async function main() {
    const imagePath = process.argv[2] || '/Users/aleph/BroncoHacks/post-ex.jpeg';
    
    if (!imagePath) {
        console.log('Usage: node clothingIdentifier.js <image_path>');
        process.exit(1);
    }

    console.log('before identify');
    const identification = await identifyClothing(imagePath);
    console.log('after identify');
    console.log(identification);
}

main();