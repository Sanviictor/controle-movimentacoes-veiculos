import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Cabecalho } from './componentes/cabecalho/cabecalho';
import { Dashboard } from './componentes/dashboard/dashboard';
import { ListaVeiculos } from './componentes/lista-veiculos/lista-veiculos';
import { RegistroMovimento } from './componentes/registro-movimento/registro-movimento';
import { NavegacaoAbas } from './componentes/navegacao-abas/navegacao-abas';
import { HistoricoRegistro } from './componentes/historico-registro/historico-registro';
import { GerenciarVeiculos } from './componentes/gerenciar-veiculos/gerenciar-veiculos';
import { Footer } from './componentes/footer/footer';
import { NoSuggestionDirective } from './no-suggestion.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Cabecalho, Dashboard, ListaVeiculos, NavegacaoAbas, RouterOutlet, Footer, NoSuggestionDirective], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('controle-veiculo-app');
}
