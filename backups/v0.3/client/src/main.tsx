import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global CSS variables to override default theme
const style = document.createElement('style');
style.textContent = `
:root {
  --lake-blue: #1E4E5F;
  --warm-sand: #E6D9C7;
  --sunset-gold: #E8B87D;
  --off-white: #F8F6F2;
  --charcoal: #333333;
}

/* Override shadcn UI default colors with our boutique hotel theme */
:root {
  --background: 40 30% 96%;
  --foreground: 20 14.3% 4.1%;
  --card: 0 0% 100%;
  --card-foreground: 20 14.3% 4.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 20 14.3% 4.1%;
  --primary: 200 32% 24%;
  --primary-foreground: 210 20% 98%;
  --secondary: 37 31% 84%;
  --secondary-foreground: 24 9.8% 10%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 34 56% 70%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 34 56% 70%;
  --radius: 0.5rem;
}

body {
  font-family: 'Montserrat', sans-serif;
  color: var(--charcoal);
  background-color: var(--off-white);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
}

.header-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.03);
}
`;

document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
