import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Details} from './details/details';
import {HousingForm} from "./housing-form/housing-form";
import {FormContacto} from "./form-contacto/form-contacto";

const routeConfig: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home page',
    },
    {
        path: 'details/:id',
        component: Details,
        title: 'Home details',
    },
    {
        path: 'newHouse',
        component: HousingForm,
        title: 'Form new house',
    },
    {
        path: 'form/:id',
        component: FormContacto,
        title: 'Formulario de contacto',
    }
];

export default routeConfig;