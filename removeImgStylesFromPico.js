import { readFileSync, writeFileSync } from 'node:fs';

console.log('removing img styles from pico.css...');

const filePath = 'node_modules/@picocss/pico/css/pico.min.css';
const file = readFileSync(filePath, 'utf8');
writeFileSync(filePath, file.replace(/img{.*?}/g, ''));
