export const DEFAULT_LIMIT = 10;

export const TABLE_HEADERS = [
  //constant tableau
  "Médecin",
  "Date création",
  "Dernière modification",
  "Actions",
];
//ce qu'on voit dans la barre d'outils
export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],           // Titres (H1, H2, H3, Normal)
    ["bold", "italic", "underline", "strike"],  // Mise en forme texte
    [{ color: [] }, { background: [] }],      
    [{ list: "ordered" }, { list: "bullet" }],//  Listes numérotées & à puces
    [{ align: [] }],                          //  Alignement
    ["blockquote", "code-block"],             //  Citation & bloc de code
    ["link"],                                 
    ["clean"],   
                               
  ],
};

export const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "blockquote",
  "code-block",
  "link",
  
];

export const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR");
