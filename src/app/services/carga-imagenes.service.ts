import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Item { nombre: string; url: string; id: string; }

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';
  private itemDoc: AngularFirestoreDocument<Item>;

  private itemsCollection: AngularFirestoreCollection<Item>;
          items: Observable<Item[]>;

  public items2 = [];
  public res: any;


  constructor( private db: AngularFirestore,
               private afs: AngularFirestore,
                ) {

                this.itemsCollection = afs.collection<Item>('img');

                this.items = this.itemsCollection.valueChanges();

                this.getAllItems().subscribe( items1 => {
                  this.items2 = items1;
                });

               }

   getAllItems() {
    return this.items = this.itemsCollection.snapshotChanges()
     .pipe(map( changes => {
       return changes.map( action => {
         const data = action.payload.doc.data() as Item;
         data.id = action.payload.doc.id;
         return data;
       });
     }));
   }

  cargarImagenesFirebase( imagenes: FileItem[] ) {

    const storageRef = firebase.storage().ref();

    for ( const item of imagenes ) {

      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask =
      storageRef.child(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`)
                .put( item.archivo );
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( snapshot: firebase.storage.UploadTaskSnapshot ) =>
        item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
        ( error ) => console.error('Error al subir', error ),
        () => {
          console.log('Imagen cargada correctamente');
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            item.url = url;
            item.estaSubiendo = false;
            this.guardarImagen({
              nombre: item.nombreArchivo,
              url: item.url,
            });
          });
        }
        );
    }
  }

  private guardarImagen( imagen: { nombre: string, url: string } ) {

    this.db.collection(`/${ this.CARPETA_IMAGENES }`)
    .add( imagen );



    // return this.items = this.itemsCollection.snapshotChanges()
    // .pipe(map( changes => {
    //   return changes.map( action => {
    //     const data = action.payload.doc.data() as Item;
    //     data.id = action.payload.doc.id;
    //     console.log('DATA', data);
    //     return data;
    //   });
    // }));
  }


  borrarImagenesFirebase ( itemid: string, itemnombre: string, i: number ) {
      this.itemDoc = this.afs.doc<Item>(`img/${itemid}`);
      this.itemDoc.delete();

      this.items2[i].nombre = 'badbunnybaby';


      for (const algo of this.items2) {
        console.log(itemnombre, algo.nombre);
        if (itemnombre === algo.nombre) {
            return;
        }
      }

      console.log('estamos detras del for');

      const storageRef = firebase.storage().ref();
      const desertRef = storageRef.child(`${ this.CARPETA_IMAGENES }/${ itemnombre }`);
      desertRef.delete().then(function() {
         console.log('File deleted successfully');
        }).catch(function(error) {
          console.log('Uh-oh, an error occurred!');
        });
  }


//    this.db.collection('img').doc(itemid).delete().then(function() {
//      console.log("Document successfully deleted!");
//      //console.log(this.db.collection('img'));
//  }).catch(function(error) {
//      console.error("Error removing document: ", error);
//  });

 descargarImagenesFirebase( itemnombre: string, itemurl: string ) {

  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(`${ this.CARPETA_IMAGENES }/${ itemnombre }`);
  let blob = null;

  fileRef.getDownloadURL().then(function(url) {

      //  console.log('it works1');
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function()  {
           blob = xhr.response;
      //     console.log('it works2');
      //     console.log(xhr.response);
      //     console.log(xhr.onload);
       };

        xhr.open('GET', url);
        xhr.send();
      // console.log('algo', blob);
      // console.log(xhr.open('GET', url));
      // console.log('it works 3');


       let img = document.getElementById('imagen');

       img.setAttribute("download", url);

      // console.log(img);

       img.click();

  }).catch(function(error) {
      console.log(error);
  });

   }


 }

