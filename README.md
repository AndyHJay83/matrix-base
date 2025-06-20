# Matrix Basic

A React TypeScript application for generating forcing matrices for mentalism and magic tricks. This tool creates 4x4 grids where any combination of one number from each column will always sum to a predetermined target number.

## Features

- **Forcing Matrix Generation**: Creates mathematically guaranteed forcing matrices
- **Multiple Categories**: Choose from CITIES, TRANSPORT, or OBJECTS for flashcards
- **Single Page Interface**: All functionality accessible from one page
- **PWA Support**: Progressive Web App with offline functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Verification**: Validates that all 256 possible combinations sum to the target

## How Forcing Matrices Work

A forcing matrix is a 4x4 grid of numbers with a special mathematical property:

- **Forcing Property**: Any combination of one number from each column (4 numbers total) will always sum to the same target number
- **Construction**: The matrix uses 8 "seed" numbers - 4 for rows and 4 for columns
- **Cell Calculation**: Each cell value = row seed + column seed
- **Mathematical Guarantee**: When you pick any one number from each column, you're adding: (row seed + col1 seed) + (row seed + col2 seed) + (row seed + col3 seed) + (row seed + col4 seed) = sum of all row seeds + sum of all column seeds = target number

This creates a "forced choice" where spectators' selections will always add up to your predetermined target, regardless of which numbers they choose from each column.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/andyhjay83/matrix-base.git
cd matrix-base
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Enter Target Number**: Choose a number between 1 and 9,999,999
2. **Select Category**: Choose from CITIES, TRANSPORT, or OBJECTS
3. **Generate**: Click the GENERATE button to create both the matrix and flashcards
4. **Use**: The generated matrix will have the forcing property, and flashcards will be randomly assigned

## Categories

### CITIES
Tokyo, New York, London, Paris, Sydney, Mumbai, Cairo, Rio de Janeiro, Moscow, Toronto, Singapore, Berlin, Madrid, Rome, Amsterdam, Vienna

### TRANSPORT
Car, Boat, Train, Plane, Bicycle, Bus, Motorcycle, Helicopter, Subway, Tram, Truck, Van, Ship, Jet, Rocket, Skateboard

### OBJECTS
Spoon, Book, Chair, Lamp, Phone, Keys, Watch, Glasses, Wallet, Pen, Cup, Hat, Shoes, Bag, Mirror, Clock

## Build for Production

```bash
npm run build
```

## Deploy to GitHub Pages

The application is configured to be deployed at `andyhjay83.github.io/matrix-basic/`:

1. Build the project: `npm run build`
2. Push to GitHub
3. Enable GitHub Pages in your repository settings
4. Set the source to the `gh-pages` branch or `/docs` folder

## Technical Details

- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite
- **PWA**: Vite PWA plugin for offline functionality
- **Styling**: CSS with modern design principles
- **Matrix Algorithm**: Uses seed-based generation with 100% variance for organic number distribution

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub. 