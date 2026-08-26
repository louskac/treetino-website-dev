import AuthController from './AuthController'
import DashboardController from './DashboardController'
import TranslationController from './TranslationController'

const Admin = {
    AuthController: Object.assign(AuthController, AuthController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    TranslationController: Object.assign(TranslationController, TranslationController),
}

export default Admin