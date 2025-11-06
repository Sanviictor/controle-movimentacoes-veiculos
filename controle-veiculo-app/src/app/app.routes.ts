import { Routes } from '@angular/router';
import { RegistroMovimento } from './componentes/registro-movimento/registro-movimento';
import { HistoricoRegistro } from './componentes/historico-registro/historico-registro';
import { GerenciarVeiculos } from './componentes/gerenciar-veiculos/gerenciar-veiculos';

export const routes: Routes = [
    { path: "", redirectTo: '/registro', pathMatch: 'full'},
    { path: 'registro', component: RegistroMovimento },
    { path: 'historico', component: HistoricoRegistro },
    { path: 'gerenciar', component: GerenciarVeiculos }

];

