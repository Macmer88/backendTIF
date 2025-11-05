import NodeCache from 'node-cache';

/**
 * stdTTL (Standard Time-To-Live): Cuánto tiempo (en segundos) vive un objeto en caché.
 * 300 segundos = 5 minutos.
 *
 * checkperiod: Cada cuántos segundos el caché buscará entradas vencidas.
 * 120 segundos = 2 minutos.
 */
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

export default cache;