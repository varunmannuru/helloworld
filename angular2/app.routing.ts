import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { SearchComponent } from './client/search/search.component'
import { ClientDetailsComponent } from './client/client-details/client-details.component'
import { HomeComponent } from './home/home.component'
import { AuthGuard } from './guards/auth.guard'
import { RTCAComponent } from './client/rtca/rtca.component'
import { RssComponent } from './client/rss/rss.component'

// import { PaginationComponent } from './pagination/pagination.component'

const appRoutes: Routes = [
  //{path: '', component:LoginComponent},
  //{path: 'login', component:LoginComponent},
  // {path: 'pagination', component: PaginationComponent},
  {  path:'', component:HomeComponent },
  {  path: 'home', component:HomeComponent ,
    children:[
    //  { path:'', component: SearchComponent},
      { path:'client',
        children:[
          {path:'search', component: SearchComponent},
          {path:'search/:searchstr', component: SearchComponent},
          {path:'details',component:ClientDetailsComponent},
          {path:'details/:id',component:ClientDetailsComponent},
          {path:'rtca-program/:id', component: RTCAComponent},
          {path:'rss-program/:id', component: RssComponent},
          {path:'new',component:ClientDetailsComponent}
         
        ]},
    ]
  }
  //,{path: 'oldclient', component:ClientComponent },
  //{path: '**', redirectTo:''}
]
export const routing = RouterModule.forRoot(appRoutes);
