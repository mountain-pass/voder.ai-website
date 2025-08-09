import './style.css';
import { VoderApp } from './VoderApp';

// Initialize the application
const app = new VoderApp();

// Make it available globally for debugging
(window as any).voderApp = app;
