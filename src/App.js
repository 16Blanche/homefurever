import './App.css';
import React from 'react'; // Add this line
import './fonts/Fonts.css';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import ProtectedRoute from './components/ProtectedRoute';

// Pets
import GetOnePet from './components/Pets/GetOnePet';
import NewPet from './components/Webpages/NewPet';


// Webpages
import Homepage from './components/Webpages/Homepage';
import Chatroom from './components/Webpages/Chatroom';
import Login from './components/Webpages/Login'
import Feedbacks from './components/Webpages/Feedbacks';
import MyPosts from './components/Webpages/MyPosts';
import NewUsers from './components/Webpages/NewUsers';
import StartingPage from './components/Webpages/StartingPage';
import PetListings from './components/Webpages/PetListings';
import UserList from './components/Webpages/UserList';
import Events from './components/Webpages/Events';
import SignUp from './components/Webpages/SignUp';

import AboutUs from './components/Users/AboutUs';
import BrowsePets from './components/Users/BrowsePets';
import PetProfile from './components/Users/PetProfile';
import Adopt from './components/Users/Adopt';
import Messages from './components/Users/Messages';
import ArchivedPets from './components/Webpages/ArchivedPets';
import { AuthProvider } from './context/AuthContext';
import DataPrivacy from './components/Users/DataPrivacy';
import ContinueAdoption from './components/Users/ContinueAdoption';
import HomePageUser from './components/Users/HomepageUser';
import Account from './components/Users/Account';
import AdminAboutUs from './components/Webpages/AdminAboutUs';
import NearbyServices from './components/Webpages/UserNearbyServices';
import UserNearbyServices from './components/Users/NearbyServices';
import BarangayTable from './components/Webpages/BarangayTable';
import Staff from './components/Webpages/Staff';
import AdminList from './components/Webpages/AdminList';
import StaffHistory from './components/Webpages/StaffHistory';
import Adoptions from './components/Webpages/Adoptions';
import PastAdoptions from './components/Webpages/PastAdoptions';
import AdoptionForm from './components/Users/AdoptionForm';
import AdoptionTracker from './components/Users/AdoptionTracker';
import UserEvents from './components/Users/UserEvents';
import UpdateCredentials from './components/Webpages/UpdateCredentials';
import UpdateMessage from './components/Webpages/UpdateMessage';
import LoggedOutBrowse from './components/Users/LoggedOutBrowse';
import LoggedOutAboutUs from './components/Users/LoggedOutAboutUs';


function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              
              {/* ADMIN */}
              <Route path='/home' element={<ProtectedRoute roles={['admin', 'super-admin']}> <Homepage/> </ProtectedRoute>} />
              <Route path='/pet/new' element={<NewPet/>}></Route>
              <Route path='/feedbacks' element={<ProtectedRoute roles={['admin', 'super-admin']}><Feedbacks/></ProtectedRoute>}></Route>
              <Route path='/posts' element={<MyPosts/>}></Route>
              <Route path='/pet/all' element={<PetListings/>}></Route>
              <Route path='/chat' element={<ProtectedRoute roles={['admin', 'super-admin']}><Chatroom/></ProtectedRoute>}></Route>
              <Route path='/user/pending' element={<ProtectedRoute roles={[ 'admin', 'super-admin']}><NewUsers/></ProtectedRoute>}></Route>
              <Route path='/user/all' element={<ProtectedRoute roles={['admin', 'super-admin']}><UserList/></ProtectedRoute>}></Route>
              <Route path='/staff' element={<ProtectedRoute roles={['admin', 'super-admin']}><Staff/></ProtectedRoute>}/>
              <Route path='/staff/history' element={<ProtectedRoute roles={['admin', 'super-admin']}><StaffHistory/></ProtectedRoute>}/>
              <Route path='/admins' element={<ProtectedRoute roles={['admin', 'super-admin']}><AdminList/></ProtectedRoute>}/>
              <Route path='/events' element={<ProtectedRoute roles={['admin', 'super-admin']}><Events/></ProtectedRoute>}></Route>
              <Route path="/pet/archived" element={<ArchivedPets/>}></Route>
              <Route path='/admin/aboutus' element={<ProtectedRoute roles={['admin', 'super-admin']}><AdminAboutUs/></ProtectedRoute>}></Route>
              <Route path="/nearby-services" element={<ProtectedRoute roles={['admin', 'super-admin']}><NearbyServices/></ProtectedRoute>} />
              <Route path='/barangay/table' element={<ProtectedRoute roles={['admin', 'super-admin']}><BarangayTable/></ProtectedRoute>}/>
              <Route path='/adoptions' element={<ProtectedRoute roles={['admin', 'super-admin']}><Adoptions/></ProtectedRoute>}/>
              <Route path='/adoptions/past' element={<ProtectedRoute roles={['admin','super-admin']}><PastAdoptions/></ProtectedRoute>}/>
              <Route path='/update-credentials' element={<ProtectedRoute roles={['pending-admin']}><UpdateCredentials/></ProtectedRoute>}/>
              <Route path='/admin/welcome' element={<ProtectedRoute roles={['pending-admin']}><UpdateMessage/></ProtectedRoute>}/>




              {/* USER */}
              <Route path='/homepageuser' element={<ProtectedRoute roles={['pending','verified']}> <HomePageUser/> </ProtectedRoute>}></Route>
              <Route path='/account' element={<ProtectedRoute roles={['pending','verified']}> <Account/> </ProtectedRoute>}></Route>
              <Route path='/aboutus' element={<ProtectedRoute roles={['pending','verified']}><AboutUs/> </ProtectedRoute>}></Route>
              <Route path="/browse/pets" element={<ProtectedRoute roles={['pending','verified']}><BrowsePets/></ProtectedRoute>}></Route>
              <Route path="/pet/profile/:id" element={<ProtectedRoute roles={['pending','verified']}> <PetProfile/> </ProtectedRoute>}></Route>
              <Route path="/pet/adoption/success" element={<ProtectedRoute roles={['verified']}> <Adopt/> </ProtectedRoute>}></Route>
              <Route path="/message" element={<ProtectedRoute roles={['pending','verified']}> <Messages/> </ProtectedRoute>}></Route>
              {/* <Route path='/dataprivacy' element={<DataPrivacy/>}></Route> */}
              {/* <Route path='/continue/adoption' element={<ContinueAdoption/>}></Route> */}
              <Route path='/nearbyservices' element={<ProtectedRoute roles={['pending','verified']}> <UserNearbyServices/> </ProtectedRoute>}></Route>
              <Route path='/pet/adoption-form/:id' element={<ProtectedRoute roles={['pending','verified']}> <AdoptionForm/> </ProtectedRoute>}></Route>
              <Route path='/adoption/tracker' element={<ProtectedRoute roles={['pending','verified']}> <AdoptionTracker/> </ProtectedRoute>}></Route>
              <Route path='/pet/events' element={<ProtectedRoute roles={['pending','verified']}> <UserEvents/> </ProtectedRoute>}></Route>
              <Route path='/pets/browse' element={ <LoggedOutBrowse/>}></Route>
              <Route path='/about/us' element={ <LoggedOutAboutUs/>}></Route>



              {/* ALL */}
              <Route path='/' element={<StartingPage/>}></Route>
              <Route path='/login' element={<Login/>}></Route>
              <Route path='/signup' element={<SignUp/>}></Route>
              <Route path='/pet/name/:pid' element={<GetOnePet/>}></Route>







            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </React.StrictMode>
      
    </div>
  );
}
 
export default App;