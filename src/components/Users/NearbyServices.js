import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PinkNavigationBar from './PinkNavigationBar';
import './Users.css';
const NearbyServices = () => {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [activeButton, setActiveButton] = useState(null);

  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15449.2815446538!2d120.99056151035074!3d14.52365753849892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c98aa3066ca5%3A0xe376b7446d803df1!2sPasay%20City%20Animal%20Shelter%2FClinic!5e0!3m2!1sen!2sph!4v1727340365399!5m2!1sen!2sph");


  const handleVeterinaryClinic = () => {
    setClinics([
      { name: "Cruz Veterinary Clinic", address: "123 Vet St, Pasay City", imageUrl: "https://images1-fabric.practo.com/cruz-veterinary-clinic-metro-manila-1453276872-569f3ec88f97e.jpg" },
      { name: "PetVet Clinic", address: "456 Vet Ave, Pasay City", imageUrl: "https://lh6.googleusercontent.com/proxy/fgDWstxUTMSlHg7aY-HKxB0Bw3YUZfbrXgVzGzThK86jsU__lkbTMy5sGWvrliMtBLs5zzm9GlVbm5NYeHhHQuissGXYZ1P5Ixr_1JonDzPPZNrNuGsYI8uzQc7cu5woGg8DLLMzkauR41DC7-DhPGxv8h5Tgo8Yt0tG6FQm4bOc=w408-h725-k-no" },
      { name: "Animal Care Clinic", address: "789 Animal Rd, Pasay City", imageUrl: "https://example.com/animal-care.jpg" },
    ]);
    setActiveButton('veterinary');
  };

  const handleNeuteringClinic = () => {
    setClinics([
      { name: "Neuter Right Clinic", address: "123 Neuter St, Pasay City", imageUrl: "https://example.com/neuter-right.jpg" },
      { name: "Spay & Neuter Center", address: "456 Spay Ave, Pasay City", imageUrl: "https://example.com/spay-center.jpg" },
    ]);
    setActiveButton('neutering');
  };

  const handlePetHotels = () => {
    setClinics([
      { name: "Pet Haven", address: "101 Pet St, Pasay City", imageUrl: "https://example.com/pet-haven.jpg" },
      { name: "The Pooch Palace", address: "202 Pooch Rd, Pasay City", imageUrl: "https://example.com/pooch-palace.jpg" },
      { name: "Furry Friends Hotel", address: "303 Furry Ave, Pasay City", imageUrl: "https://example.com/furry-friends.jpg" },
    ]);
    setActiveButton('petHotels');
  };

  const handleGrooming = () => {
    setClinics([
      { name: "Grooming Galore", address: "404 Grooming St, Pasay City", imageUrl: "https://example.com/grooming-galore.jpg" },
      { name: "Pampered Paws", address: "505 Pampered Rd, Pasay City", imageUrl: "https://example.com/pampered-paws.jpg" },
      { name: "The Dog Spa", address: "606 Dog Spa St, Pasay City", imageUrl: "https://example.com/dog-spa.jpg" },
    ]);
    setActiveButton('grooming');
  };

  const handleServiceClick = (service) => {
    if (service === "Cruz Veterinary Clinic") {
      setMapSrc("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15447.312819694997!2d120.98304895968016!3d14.55181479999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c965dc41fda7%3A0xc4602a2bec67d49f!2sCruz%20Veterinary%20Clinic!5e0!3m2!1sen!2sph!4v1727341995699!5m2!1sen!2sph");
    }
  }

  return (
    <div className='nearbybox1'>
        <div className='navbox'>
            <PinkNavigationBar />
        </div>
        <div className='nearbybox2'>
            <div className='nearbybox6'>
                <div className='nearbybox3'>
                    <h2>Nearby</h2>
                    <h3>Services</h3>
                    <h4>IN PASAY CITY</h4>
                
                    <div className='nearbybox4'>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'veterinary' ? 'white' : '#d2d2d5', color: activeButton === 'veterinary' ? 'black' : 'white' }} onClick={handleVeterinaryClinic}>Vet Clinics</Button>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'neutering' ? 'white' : '#d2d2d5', color: activeButton === 'neutering' ? 'black' : 'white' }} onClick={handleNeuteringClinic}>Neutering</Button>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'petHotels' ? 'white' : '#d2d2d5', color: activeButton === 'petHotels' ? 'black' : 'white' }} onClick={handlePetHotels}>Pet Hotels</Button>
                        <Button className='nearbybtns' style={{ backgroundColor: activeButton === 'grooming' ? 'white' : '#d2d2d5', color: activeButton === 'grooming' ? 'black' : 'white' }} onClick={handleGrooming}>Grooming</Button>
                    </div>
                    <div className='availableClinics'>
                        {clinics.length > 0 && (
                            <div className='clinicsContainer'>
                                {clinics.map((clinic, index) => (
                                    <div className='clinicBox' key={index} onClick={() => handleServiceClick(clinic.name)}>
                                        <img src={clinic.imageUrl} alt={clinic.name} />
                                        <div className='clinicInfo'>
                                            <h5>{clinic.name}</h5>
                                            <p>{clinic.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='nearbybox5'>
                <div className='nearbymapbox'>
                <iframe
                    width="100%"
                    height="750"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={mapSrc}
                ></iframe>
                </div>
            </div>
        </div>
    </div>
  );
};

export default NearbyServices;
