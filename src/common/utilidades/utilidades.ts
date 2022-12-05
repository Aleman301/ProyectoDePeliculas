
class Utilidades {

    public formateoDePalabras (palabras: string) {
        
        return palabras.trim().toLowerCase().split(' ')
                       .filter(s => s !== '').join(' ')
                       .replace(/(^\w{1})|(\s+\w{1})/g, palabra => palabra.toUpperCase());

    };
    
}

export default new Utilidades();
