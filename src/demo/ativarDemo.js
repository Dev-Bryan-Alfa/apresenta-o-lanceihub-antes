// Liga o modo demonstração quando o build é feito com REACT_APP_DEMO=true (GitHub Pages).
// Precisa ser importado antes de qualquer axios.create(), para a instância da API herdar o adaptador.
import axios from 'axios';
import adaptadorDemo from './adaptadorDemo';

export const MODO_DEMO = process.env.REACT_APP_DEMO === 'true';

if (MODO_DEMO) {
  axios.defaults.adapter = adaptadorDemo;
}
