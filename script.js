import { db } from "./js/firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// =====================================
// LOAD WEBSITE
// =====================================

async function loadWebsite() {

    try {

        // =========================
        // WEBSITE SETTINGS
        // =========================

        const websiteRef = doc(db, "website", "settings");
        const websiteSnap = await getDoc(websiteRef);

        if (websiteSnap.exists()) {

            const data = websiteSnap.data();
            console.log(data.primaryColor);
            console.log(data.secondaryColor);

            // Hero

            document.getElementById("schoolNameDisplay").textContent =
                data.schoolName || "";

            document.getElementById("unitNameDisplay").textContent =
                data.unitName || "";

            document.getElementById("establishedDisplay").textContent =
                "Established " + (data.established || "");

            document.getElementById("mottoDisplay").textContent =
                "⚜ " + (data.motto || "");

            // Footer

            document.getElementById("footerSchoolName").textContent =
                data.schoolName || "";

            document.getElementById("footerUnitName").textContent =
                data.unitName || "";

            document.getElementById("footerMotto").textContent =
                "⚜ " + (data.motto || "") + " ⚜";

            // Theme Colors

            document.documentElement.style.setProperty(
                "--primary-color",
                data.primaryColor || "#14532D"
            );

            document.documentElement.style.setProperty(
                "--secondary-color",
                data.secondaryColor || "#D4AF37"
            );

            // Logo

            if (data.logoURL) {

                document.getElementById("websiteLogo").src =
                    data.logoURL;

                document.getElementById("footerLogo").src =
                    data.logoURL;

            }

            // Hero Background

            if (data.backgroundURL) {

                document.querySelector(".hero").style.backgroundImage =
                    `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${data.backgroundURL}')`;

            }

        }

        // =========================
        // ABOUT
        // =========================

        const aboutRef = doc(db, "about", "content");
        const aboutSnap = await getDoc(aboutRef);

        if (aboutSnap.exists()) {

            const about = aboutSnap.data();

            document.getElementById("aboutTitleDisplay").textContent =
                about.title || "";

            document.getElementById("aboutSubtitleDisplay").textContent =
                about.subtitle || "";

            document.getElementById("whoWeAreDisplay").textContent =
                about.whoWeAre || "";

            document.getElementById("ourMottoDisplay").textContent =
                about.motto || "";

            document.getElementById("missionDisplay").textContent =
                about.mission || "";

            document.getElementById("visionDisplay").textContent =
                about.vision || "";

            document.getElementById("valuesDisplay").textContent =
                about.values || "";

        }

        // =========================
        // CONTACT
        // =========================

        const contactRef = doc(db, "contact", "details");
        const contactSnap = await getDoc(contactRef);

        if (contactSnap.exists()) {

            const contact = contactSnap.data();

            document.getElementById("addressDisplay").innerHTML =
                contact.address || "";

            document.getElementById("emailDisplay").textContent =
                contact.email || "";

            document.getElementById("phoneDisplay").textContent =
                contact.phone || "";

        }

    }

    catch (error) {

        console.error(error);

    }

}

// =====================================
// LOAD LEADERS
// =====================================

async function loadLeaders() {

    const leadersContainer =
        document.getElementById("leadersContainer");

    leadersContainer.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "leaders"));

    snapshot.forEach(doc => {

        const leader = doc.data();

        leadersContainer.innerHTML += `

        <div class="leader-card">

            <div class="leader-image">

                <img src="${leader.photo}" alt="${leader.name}">

            </div>

            <h3>${leader.name}</h3>

            <span class="role">

                ${leader.position}

            </span>

            <p>

                ${leader.description}

            </p>

        </div>

        `;

    });

}

// =====================================
// LOAD MEMBERS
// =====================================

async function loadMembers() {

    const roverContainer =
        document.getElementById("roversContainer");

    const rangerContainer =
        document.getElementById("rangersContainer");

    roverContainer.innerHTML = "";
    rangerContainer.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "members"));

    snapshot.forEach(doc => {

        const member = doc.data();

        const card = `

        <div class="member-card">

            <img src="${member.photo}" alt="${member.name}">

            <h4>${member.name}</h4>

            <span>${member.role}</span>

            <p>BSG UID : ${member.uid}</p>

        </div>

        `;

        if (member.team === "Rover") {

            roverContainer.innerHTML += card;

        }

        else {

            rangerContainer.innerHTML += card;

        }

    });

}
// =====================================
// LOAD STATISTICS
// =====================================

async function loadStatistics() {

    const membersSnapshot =
        await getDocs(collection(db, "members"));

    let totalMembers = 0;
    let rovers = 0;
    let rangers = 0;

    membersSnapshot.forEach(doc => {

        totalMembers++;

        const member = doc.data();

        if (member.team === "Rover") {

            rovers++;

        }

        else if (member.team === "Ranger") {

            rangers++;

        }

    });

    document.getElementById("totalMembers").textContent =
        totalMembers;

    document.getElementById("totalRovers").textContent =
        rovers;

    document.getElementById("totalRangers").textContent =
        rangers;

    // Established Year

    const websiteRef = doc(db, "website", "settings");

    const websiteSnap = await getDoc(websiteRef);

    if (websiteSnap.exists()) {

        const data = websiteSnap.data();

        document.getElementById("establishedYear").textContent =
            data.established || "";

    }

}
async function loadEvents() {

    const eventsContainer =
        document.getElementById("eventsContainer");

    eventsContainer.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "events"));

    const events = [];

    snapshot.forEach(doc => {

        events.push(doc.data());

    });

    events.forEach(event => {

        eventsContainer.innerHTML += `

        <div class="event-card">

            <img src="${event.poster}">

            <div class="event-content">

                <h3>${event.title}</h3>

                <p class="event-date">

                    📅 ${event.date}

                </p>

                <p class="event-venue">

                    📍 ${event.venue}

                </p>

                <p>

                    ${event.description}

                </p>

            </div>

        </div>

        `;

    });

}


async function loadGallery() {

    const galleryContainer =
        document.getElementById("galleryContainer");

    console.log(galleryContainer); // <-- ADD THIS

    galleryContainer.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "gallery"));

    console.log(snapshot.size); // <-- ADD THIS

    const images = [];

    snapshot.forEach(doc => {

        images.push(doc.data());

    });

    console.log(images); // <-- ADD THIS

    images.forEach(image => {

        galleryContainer.innerHTML += `

        <div class="gallery-card">

            <img src="${image.image}" alt="${image.title}">

            <h3>${image.title}</h3>

        </div>

        `;

    });

}
loadWebsite();
loadLeaders();
loadMembers();
loadStatistics();
loadEvents();
loadGallery();
window.addEventListener("load",()=>{

const particles=document.querySelector(".particles");

for(let i=0;i<80;i++){

const s=document.createElement("div");

s.className="spark";

s.style.left="50%";

s.style.top="50%";

s.style.setProperty("--x",

(Math.random()*800-400)+"px");

s.style.setProperty("--y",

(Math.random()*800-400)+"px");

s.style.animationDelay=(Math.random()*1.5)+"s";

particles.appendChild(s);

}

setTimeout(()=>{

const loader=document.getElementById("loader");

loader.classList.add("hide");

setTimeout(()=>{

loader.remove();

},1000);

},3200);

});
