import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const ProfilPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        nom: "Ben Ahmed",
        prenom: "Mohamed",
        sexe: "Masculin",
        dateNaissance: "1985-05-15",
        specialite: "Cardiologie",
        region: "Tunis",
        telephone: "+216 98 123 456",
        email: "mohamed.benahmed@mail.com",
        adresse: "Avenue Habib Bourguiba, Tunis 1000",
        numOrdre: "TUN-12345",
        bio: "Cardiologue expérimenté avec plus de 15 ans de pratique. Spécialisé dans les maladies cardiovasculaires et la prévention.",
    });

    const [editData, setEditData] = useState({ ...profileData });

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profileData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...profileData });
    };

    const handleSave = () => {
        setProfileData({ ...editData });
        setIsEditing(false);
        // Appel API ici pour sauvegarder
        console.log("Données sauvegardées:", editData);
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container-fluid py-4">
 <div className="container-fluid py-4">
    {/* Header */}
    <div className="row mb-4 justify-content-center">
        <div className="col-12 text-center">
            <h2 className="fw-bold text-gray-800 mb-2 d-flex justify-content-center align-items-center">
                Mon Profil
            </h2>
        </div>
    </div>
</div>


            {/* Profile Card */}
            <div className="row">
                <div className="col-lg-4 mb-4">
                    {/* Photo et Informations de Base */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-4">
                            {/* Photo de profil */}
                            <div className="position-relative d-inline-block mb-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                        color: 'white',
                                        fontSize: '3rem'
                                    }}
                                >
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                {!isEditing && (
                                    <button
                                        className="btn btn-sm btn-light rounded-circle position-absolute"
                                        style={{
                                            bottom: '0',
                                            right: '0',
                                            width: '35px',
                                            height: '35px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                        }}
                                    >
                                        <i className="bi bi-camera"></i>
                                    </button>
                                )}
                            </div>

                            {/* Nom et Spécialité */}
                            <h4 className="fw-bold mb-1">
                                Dr. {profileData.prenom} {profileData.nom}
                            </h4>
                            <p className="text-muted mb-2">{profileData.specialite}</p>
                            <span
                                className="badge rounded-pill px-3 py-2"
                                style={{
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    color: '#16a34a'
                                }}
                            >
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Compte activé
                            </span>

 
                        </div>
                    </div>

                    {/* Bouton d'action */}
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="btn btn-lg w-100 mt-3 text-white"
                            style={{
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                border: 'none'
                            }}
                        >
                            <i className="bi bi-pencil-square me-2"></i>
                            Modifier le Profil
                        </button>
                    ) : (
                        <div className="mt-3 d-flex gap-2">
                            <button
                                onClick={handleSave}
                                className="btn btn-lg flex-fill text-white"
                                style={{
                                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                    border: 'none'
                                }}
                            >
                                <i className="bi bi-check-lg me-2"></i>
                                Enregistrer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn btn-lg btn-outline-secondary flex-fill"
                            >
                                <i className="bi bi-x-lg me-2"></i>
                                Annuler
                            </button>
                        </div>
                    )}
                    <br/>
                                        <br/>


                                    <div className="text-center">
                  <NavLink 
                    to="/mainPageMed" 
                    className="text-sm text-green-600 hover:text-green-700 hover:underline"
                  >
                    ← Retour 
                  </NavLink>
                </div>
                           
                </div>

                {/* Informations Détaillées */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">
                                <i className="bi bi-info-circle me-2" style={{ color: '#22c55e' }}></i>
                                Informations Personnelles
                            </h5>

                            <div className="row g-4">
                                {/* Nom */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-person me-1"></i>
                                        Nom
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.nom}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="nom"
                                            value={editData.nom}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}
                                </div>

                                {/* Prénom */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-person me-1"></i>
                                        Prénom
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.prenom}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="prenom"
                                            value={editData.prenom}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}
                                </div>

                                {/* Sexe */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-gender-ambiguous me-1"></i>
                                        Sexe
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.sexe}</p>
                                    ) : (
                                        <select
                                            name="sexe"
                                            value={editData.sexe}
                                            onChange={handleChange}
                                            className="form-select"
                                            style={{ borderColor: '#e5e7eb' }}
                                        >
                                            <option value="Masculin">Masculin</option>
                                            <option value="Féminin">Féminin</option>
                                        </select>
                                    )}
                                </div>

                                {/* Date de Naissance */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-calendar me-1"></i>
                                        Date de Naissance
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">
                                            {new Date(profileData.dateNaissance).toLocaleDateString('fr-FR')}
                                        </p>
                                    ) : (
                                        <input
                                            type="date"
                                            name="dateNaissance"
                                            value={editData.dateNaissance}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}
                                </div>

                                {/* Spécialité */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-heart-pulse me-1"></i>
                                        Spécialité
                                    </label>

                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.specialite}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="specialite"
                                            value={editData.specialite}
                                            onChange={handleChange}
                                            className="form-select"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}


                                </div>

                                {/* Région */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        Région
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.region}</p>
                                    ) : (
                                        <select
                                            name="region"
                                            value={editData.region}
                                            onChange={handleChange}
                                            className="form-select"
                                            style={{ borderColor: '#e5e7eb' }}
                                        >
                                            <option value="Kairouan">Kairouan</option>
                                            <option value="Gafsa">Gafsa</option>
                                            <option value="Tozeur">Tozeur</option>
                                            <option value="Gabès">Gabès</option>
                                            <option value="Medenine">Medenine</option>
                                            <option value="Tataouine">Tataouine</option>
                                            <option value="Sidi Bouzid">Sidi Bouzid</option>
                                            <option value="Kasserine">Kasserine</option>
                                            <option value="Jendouba">Jendouba</option>
                                            <option value="Le Kef">Le Kef</option>
                                            <option value="Béja">Béja</option>
                                            <option value="Manouba">Manouba</option>
                                            <option value="Zaghouan">Zaghouan</option>
                                            <option value="Nabeul">Nabeul</option>
                                            <option value="Mahdia">Mahdia</option>
                                            <option value="Monastir">Monastir</option>
                                            <option value="Sousse">Sousse</option>
                                            <option value="M'saken">M'saken</option>
                                            <option value="Ben Arous">Ben Arous</option>
                                            <option value="La Manouba">La Manouba</option>
                                            <option value="Tunis">Tunis</option>
                                            <option value="Sfax">Sfax</option>
                                            <option value="Bizerte">Bizerte</option>
                                            <option value="Ariana">Ariana</option>

                                        </select>
                                    )}
                                </div>

                                {/* Téléphone */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-telephone me-1"></i>
                                        Téléphone
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.telephone}</p>
                                    ) : (
                                        <input
                                            type="tel"
                                            name="telephone"
                                            value={editData.telephone}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}
                                </div>

                                {/* Email */}
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-envelope me-1"></i>
                                        Email
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.email}</p>
                                    ) : (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}
                                </div>

                                {/* Adresse */}
                                <div className="col-12">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-house me-1"></i>
                                        Adresse
                                    </label>
                                    {!isEditing ? (
                                        <p className="fw-semibold fs-6 mb-0">{profileData.adresse}</p>
                                    ) : (
                                        <input
                                            type="text"
                                            name="adresse"
                                            value={editData.adresse}
                                            onChange={handleChange}
                                            className="form-control"
                                            style={{ borderColor: '#e5e7eb' }}
                                        />
                                    )}
                                </div>

                                {/* Biographie */}
                                <div className="col-12">
                                    <label className="form-label text-muted small mb-1">
                                        <i className="bi bi-file-text me-1"></i>
                                        Biographie
                                    </label>
                                    {!isEditing ? (
                                        <p className="fs-6 mb-0 text-secondary">{profileData.bio}</p>
                                    ) : (
                                        <textarea
                                            name="bio"
                                            value={editData.bio}
                                            onChange={handleChange}
                                            className="form-control"
                                            rows="3"
                                            style={{ borderColor: '#e5e7eb' }}
                                        ></textarea>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">
                                <i className="bi bi-shield-lock me-2" style={{ color: '#22c55e' }}></i>
                                Sécurité
                            </h5>
                            <NavLink to="/reset-password">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    

                                    <button className="btn btn-outline-success w-100">
                                        <i className="bi bi-key me-2"></i>
                                        Changer le mot de passe
                                    </button>
                                </div>

                            </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilPage;