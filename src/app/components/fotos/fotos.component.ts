import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CargaImagenesService } from '../../services/carga-imagenes.service';
import { map } from 'rxjs/operators';

export interface Item { nombre: string; url: string; id: string; }

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [
  ]
})
export class FotosComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;


  public items2 = [];
  public item = '';


  constructor(private afs: AngularFirestore,
              public _cargaImagenes: CargaImagenesService) {



    this.itemsCollection = afs.collection<Item>('img');

    this.items = this.itemsCollection.valueChanges();
    this._cargaImagenes.getAllItems().subscribe( items1 => {
      //console.log( 'ITEMS', items1);
      this.items2 = items1;

    });

   }


  ngOnInit(): void {
  }

  onBorrarFoto( i: number ) {
    //console.log( this.items2 );
    this._cargaImagenes.borrarImagenesFirebase( this.items2[i].id, this.items2[i].nombre, i );
    //this._cargaImagenes.deleteItem(idItem);
  }

  downloadImage( itemnombre: string, itemurl: string ) {
    
    this._cargaImagenes.descargarImagenesFirebase( itemnombre, itemurl );

    }
}
