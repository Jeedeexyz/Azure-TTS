# AudioVisualizer

## Overview

AudioVisualizer is a web application that uses Azure Text-to-Speech (TTS) to synthesize speech from text input and visualize the audio frequencies in real-time.

## Usage

### Prerequisites

- An Azure account with a Speech service resource.
- A web browser that supports the Web Audio API.

### Getting Azure Credentials

1. **Create an Azure Account**:

   - If you don't have an Azure account, you can create one for free at [Azure Free Account](https://azure.microsoft.com/free/).

2. **Create a Speech Service Resource**:

   - Go to the [Azure Portal](https://portal.azure.com/).
   - Click on "Create a resource".
   - Search for "Speech" and select "Speech" from the list.
   - Click "Create".
   - Fill in the required details:
     - **Subscription**: Select your Azure subscription.
     - **Resource group**: Create a new resource group or select an existing one.
     - **Region**: Choose a region close to you.
     - **Name**: Provide a name for your Speech service resource.
   - Click "Review + create" and then "Create".

3. **Get the Subscription Key and Region**:
   - Once the resource is created, go to the resource's "Keys and Endpoint" page.
   - Copy one of the keys (this is your subscription key).
   - Note the region where your resource is deployed (this is your region).

### Running the Application

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/yourusername/AudioVisualizer.git
   cd AudioVisualizer
   ```

2. **Open the HTML File**:

   - Open AudioVisualizer.html in your browser.

3. **Enter Your Azure Credentials**:

   - Enter your subscription key and the region in the respective input fields.

4. **Enter Text and Synthesize**:

   - Enter the text you want to synthesize in the text input field.
   - Click the "Synthesize" button generate the audio.

5. **Control Audio PlayBack**:
   - Use the "Play" and "Pause" buttons to control the audio playback.

## Troubleshooting

- **Issue**: The audio does not play.
  - **Solution**: Make sure you have the synthesized the audio first clicking the "Synthesize" button

## License

### This is licensed under the MIT License.
