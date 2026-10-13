import Web3Controller from './Web3Controller'
import HomeController from './HomeController'
import LocaleController from './LocaleController'
import ConfiguratorController from './ConfiguratorController'
import SalesController from './SalesController'
import ProductsController from './ProductsController'
import CollaborationController from './CollaborationController'
import MediaController from './MediaController'
import ContactController from './ContactController'
import LegalController from './LegalController'
import Api from './Api'
import OrderController from './OrderController'
import Settings from './Settings'
import Admin from './Admin'

const Controllers = {
    Web3Controller: Object.assign(Web3Controller, Web3Controller),
    HomeController: Object.assign(HomeController, HomeController),
    LocaleController: Object.assign(LocaleController, LocaleController),
    ConfiguratorController: Object.assign(ConfiguratorController, ConfiguratorController),
    SalesController: Object.assign(SalesController, SalesController),
    ProductsController: Object.assign(ProductsController, ProductsController),
    CollaborationController: Object.assign(CollaborationController, CollaborationController),
    MediaController: Object.assign(MediaController, MediaController),
    ContactController: Object.assign(ContactController, ContactController),
    LegalController: Object.assign(LegalController, LegalController),
    Api: Object.assign(Api, Api),
    OrderController: Object.assign(OrderController, OrderController),
    Settings: Object.assign(Settings, Settings),
    Admin: Object.assign(Admin, Admin),
}

export default Controllers