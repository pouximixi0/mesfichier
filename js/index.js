// Configurer votre application Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJdM4UakUouxxpaRWy8xrg4DedIkpbxZM",
  authDomain: "test-4c047.firebaseapp.com",
  projectId: "test-4c047",
  storageBucket: "test-4c047.appspot.com",
  messagingSenderId: "941171550413",
  appId: "1:941171550413:web:30ce3d3ef6642119376184",
  measurementId: "G-BY40540J05",
};
// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
document.getElementById("TextError").style.visibility = "hidden";

var User = recupererCookie("user");
//Verification connexion deja effectuer
function recupererCookie(nom) {
  nom = nom + "=";
  var liste = document.cookie.split(";");
  for (var i = 0; i < liste.length; i++) {
    var c = liste[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nom) == 0) return c.substring(nom.length, c.length);
  }
  return null;
}
const documentReference = db.collection("utilisateurs").doc(User);
console.log("debut verification cookie");
documentReference
  .get()
  .then((doc) => {
    if (doc.exists) {
      userId = doc.data().userID;
      console.log("verification en cours" + userId);
      if (recupererCookie("connected") == userId) {
        console.log("connexion");
        window.location.href = "index2.html";
      }
    } else {
      console.log("Le document n'existe pas.");
    }
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la récupération des données du document : ",
      error
    );
  });

//connexion

function creerCookie(nom, contenu, jours) {
  var e = null;
  var date = new Date();
  date.setTime(date.getTime() + jours * 24 * 60 * 60 * 1000);
  e = "; expires=" + date.toGMTString();
  document.cookie = nom + "=" + contenu + e + "; path=/";
}
var idUser;
// Fonction de connexion
function login() {
  const userName = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(userName, password)
    .then((userCredential) => {
      // L'utilisateur est connecté avec succès

      idUser = Math.floor(Math.random() * 54811436489463578);

      const dataToWrite = {
        userID: idUser,
      };

      const userDocument = db.collection("username").doc(userName);
      const documentReference = db.collection("utilisateurs").doc(userName);
      userDocument.get().then((doc) => {
        UserChatValue = doc.data().UserChat;
        creerCookie("UserChat", UserChatValue, 1);
      });

      const user = userCredential.user;
      console.log("Utilisateur connecté:", user);
      creerCookie("connected", idUser, 1);
      creerCookie("user", userName, 1);
      documentReference
        .set(dataToWrite)
        .then(() => {
          console.log("Données ajoutées avec succès au document : ");
          window.location.href = "index2.html";
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'ajout des données au document : ",
            error
          );
        });
    })

    .catch((error) => {
      // Une erreur s'est produite lors de la connexion
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erreur de connexion:", errorMessage);
      document.getElementById("TextError").style.visibility = "visible";
    });
}
