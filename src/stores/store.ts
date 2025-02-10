import { create } from 'zustand'

const useAnnotationStore = create((set) => ({
 Columns: {
     columnLabel: {
        values: [],
        description: "",
        dataType: "",
        standardizedVariable:"",
     },
 }
}));

 
 function generateDataDictionary(){
    //use the Columns to create the data dictionary
 }
  