const firebaseConfig = {
  apiKey: "AIzaSyDJdM4UakUouxxpaRWy8xrg4DedIkpbxZM",
  authDomain: "test-4c047.firebaseapp.com",
  projectId: "test-4c047",
  storageBucket: "test-4c047.appspot.com",
  messagingSenderId: "941171550413",
  appId: "1:941171550413:web:30ce3d3ef6642119376184",
  measurementId: "G-BY40540J05",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var userId;
var User = recupererCookie("user");
const isPresence = true;

if (!User) {
  console.log("document vide");
  window.location.href = "erreurConnexion.html";
}
const documentReference = db.collection("utilisateurs").doc(User);
const userConnected = db.collection("userConnected");
userConnected
  .doc(recupererCookie("user"))
  .set({ connectedName: recupererCookie("UserChat") });

documentReference
  .get()
  .then((doc) => {
    if (doc.exists) {
      userId = doc.data().userID;
      if (recupererCookie("connected") == userId) {
        console.log("Cookies OK");
      } else {
        console.log("Cookie non OK");
        window.location.href = "erreurConnexion.html";
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

function deleteCookie() {
  db.collection("userConnected").doc(recupererCookie("user")).delete();
  const documentReference = db.collection("utilisateurs").doc(User);
  const dataToWrite = {
    userID: 0,
  };
  console.log("moddification en cours");
  documentReference
    .set(dataToWrite)
    .then(() => {
      console.log("Données ajoutées avec succès au document : ");
      window.location.href = "ConnextionSucece.html";
      document.cookie =
        "connected=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
      document.cookie = "user=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
      document.cookie =
        "UserChat=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout des données au document : ", error);
    });
}

/* chat */
const connectedUser = db.collection("userConnected");
const BoxConnectedUser = document.getElementById("userConnectedDiv");

connectedUser.onSnapshot((snapshot) => {
  BoxConnectedUser.innerHTML = "";

  snapshot.forEach((doc) => {
    value = doc.data();
    UserNameP = document.createElement("p");
    if (value.chat && isPresence) {
      UserNameP.textContent = value.connectedName + "(est dans le chat)";
    } else if (isPresence) {
      UserNameP.textContent = value.connectedName + "(n'est pas dans le chat)";
    } else {
      UserNameP.textContent = "";
    }
    UserNameP.classList.add("UserConnectedClass");
    BoxConnectedUser.appendChild(UserNameP);
  });
});

window.onbeforeunload = function (event) {
  db.collection("userConnected").doc(recupererCookie("user")).delete();
};
