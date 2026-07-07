import {

    loadWebsiteSettings,
    saveWebsiteSettings,

    addLeader,
    getLeaders,
    updateLeader,
    deleteLeader,

    addMember,
    getMembers,
    updateMember,
    deleteMember,

    addEvent,
    getEvents,
    updateEvent,
    deleteEvent,

    loadAbout,
    saveAbout,

    loadContact,
    saveContact,

    addGallery,
    getGallery,
    updateGallery,
    deleteGallery

} from "../js/firestore.js";
import { uploadImage } from "../js/cloudinary.js";
import { auth } from "../js/firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { db } from "../js/firebase.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
// =====================================
// Protect Dashboard
// =====================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        navButtons.forEach(btn => btn.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active"));

        button.classList.add("active");

        document
            .getElementById(button.dataset.section)
            .classList.add("active");

    });

});

// =========================
// Inputs
// =========================

const schoolName = document.getElementById("schoolName");
const unitName = document.getElementById("unitName");
const motto = document.getElementById("motto");
const established = document.getElementById("established");

const primaryColor = document.getElementById("primaryColor");
const secondaryColor = document.getElementById("secondaryColor");

const logoFile = document.getElementById("logoFile");
const backgroundFile = document.getElementById("backgroundFile");

const saveBtn = document.getElementById("saveWebsite");

const leaderName = document.getElementById("leaderName");
const leaderPosition = document.getElementById("leaderPosition");
const leaderDescription = document.getElementById("leaderDescription");
const leaderPhoto = document.getElementById("leaderPhoto");

const saveLeader = document.getElementById("saveLeader");
const leadersList = document.getElementById("leadersList");
let editingLeaderId = null;
// =========================
// Members
// =========================

const memberName = document.getElementById("memberName");
const memberRole = document.getElementById("memberRole");
const memberUID = document.getElementById("memberUID");
const memberTeam = document.getElementById("memberTeam");
const memberPhoto = document.getElementById("memberPhoto");

const saveMember = document.getElementById("saveMember");
const membersList = document.getElementById("membersList");
let editingMemberId = null;
// =========================
// Gallery
// =========================

const galleryTitle = document.getElementById("galleryTitle");
const galleryImage = document.getElementById("galleryImage");

const saveGallery = document.getElementById("saveGallery");

const galleryList = document.getElementById("galleryList");
let editingGalleryId = null;
// =========================
// About
// =========================

const aboutTitle = document.getElementById("aboutTitle");
const whoWeAre = document.getElementById("whoWeAre");
const ourMotto = document.getElementById("ourMotto");
const missionText = document.getElementById("missionText");
const visionText = document.getElementById("visionText");
const valuesText = document.getElementById("valuesText");
const aboutSubtitle = document.getElementById("aboutSubtitle");
const saveAboutBtn = document.getElementById("saveAbout");
// =========================
// Contact
// =========================
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventVenue = document.getElementById("eventVenue");
const eventDescription = document.getElementById("eventDescription");
const eventPoster = document.getElementById("eventPoster");

const saveEvent = document.getElementById("saveEvent");
const eventsList = document.getElementById("eventsList");

let editingEventId = null;
const contactAddress = document.getElementById("contactAddress");
const contactEmail = document.getElementById("contactEmail");
const contactPhone = document.getElementById("contactPhone");

const saveContactBtn = document.getElementById("saveContact");
const leaderCount = document.getElementById("leaderCount");
const memberCount = document.getElementById("memberCount");
const galleryCount = document.getElementById("galleryCount");
const eventCount = document.getElementById("eventCount");
const logoutBtn = document.getElementById("logoutBtn");
async function loadData() {

    try {

        const data = await loadWebsiteSettings();

        if (!data) return;

        schoolName.value = data.schoolName || "";
        unitName.value = data.unitName || "";
        motto.value = data.motto || "";
        established.value = data.established || "";

        primaryColor.value =
            data.primaryColor || "#14532D";

        secondaryColor.value =
            data.secondaryColor || "#D4AF37";

    }

    catch (error) {

        console.error(error);

    }

}

loadData();

// =========================
// Save Settings
// =========================

saveBtn.addEventListener("click", async () => {

    saveBtn.innerText = "Saving...";

    try {

        let logoURL = "";
        let backgroundURL = "";

        // Upload Logo

        if (logoFile.files.length > 0) {

            logoURL = await uploadImage(
                logoFile.files[0]
            );

        }

        // Upload Background

        if (backgroundFile.files.length > 0) {

            backgroundURL = await uploadImage(
                backgroundFile.files[0]
            );

        }

        const existingData =
            await loadWebsiteSettings();

        await saveWebsiteSettings({

            schoolName: schoolName.value,

            unitName: unitName.value,

            motto: motto.value,

            established: established.value,

            primaryColor: primaryColor.value,

            secondaryColor: secondaryColor.value,

            // Keep old image if no new image uploaded

            logoURL:
                logoURL ||
                existingData?.logoURL ||
                "",

            backgroundURL:
                backgroundURL ||
                existingData?.backgroundURL ||
                ""

        });

        alert("Website Settings Saved Successfully!");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveBtn.innerText = "Save Changes";

});
// =========================
// Load Leaders
// =========================

async function loadLeaders() {

    leadersList.innerHTML = "";

    const leaders = await getLeaders();

    leaders.forEach(leader => {

    leadersList.innerHTML += `

    <div class="card">

        <img
            src="${leader.photo}"
            style="
                width:80px;
                height:80px;
                border-radius:50%;
                object-fit:cover;
                margin-bottom:15px;
            ">

        <h3>${leader.name}</h3>

        <p>${leader.position}</p>

        <div style="margin-top:15px;display:flex;gap:10px;justify-content:center;">

            <button
                class="save-btn editLeader"
                data-id="${leader.id}">

                Edit

            </button>

            <button
                class="logout-btn deleteLeader"
                data-id="${leader.id}">

                Delete

            </button>

        </div>

    </div>

    `;

});
}

loadLeaders();
// =====================================
// Leader Edit & Delete Buttons
// =====================================

leadersList.addEventListener("click", async (e) => {

    // --------------------------
    // DELETE
    // --------------------------

    if (e.target.classList.contains("deleteLeader")) {

        const id = e.target.dataset.id;

        if (!confirm("Delete this leader?")) return;

        await deleteLeader(id);

        await loadLeaders();

        await loadDashboardStats();

        alert("Leader Deleted!");

    }

    // --------------------------
    // EDIT
    // --------------------------

    if (e.target.classList.contains("editLeader")) {

        const id = e.target.dataset.id;

        const leaders = await getLeaders();

        const leader = leaders.find(l => l.id === id);

        if (!leader) return;

        editingLeaderId = id;

        leaderName.value = leader.name;
        leaderPosition.value = leader.position;
        leaderDescription.value = leader.description;

        saveLeader.innerText = "Update Leader";

    }

});

saveLeader.addEventListener("click", async () => {

    if (
        leaderName.value.trim() === "" ||
        leaderPosition.value.trim() === ""
    ) {

        alert("Please fill all required fields.");

        return;

    }

    saveLeader.innerText = "Saving...";

    try {

        let photoURL = "";

        // Upload new image if selected

        if (leaderPhoto.files.length > 0) {

            photoURL = await uploadImage(

                leaderPhoto.files[0]

            );

        }

        // ===========================
        // UPDATE
        // ===========================

        if (editingLeaderId) {

            const leaders = await getLeaders();

            const oldLeader = leaders.find(

                l => l.id === editingLeaderId

            );

            await updateLeader(editingLeaderId, {

                name: leaderName.value,

                position: leaderPosition.value,

                description: leaderDescription.value,

                photo: photoURL || oldLeader.photo

            });

            alert("Leader Updated!");

            editingLeaderId = null;

            saveLeader.innerText = "Save Leader";

        }

        // ===========================
        // ADD NEW
        // ===========================

        else {

            if (!photoURL && leaderPhoto.files.length === 0) {

                alert("Please select a photo.");

                saveLeader.innerText = "Save Leader";

                return;

            }

            await addLeader({

                name: leaderName.value,

                position: leaderPosition.value,

                description: leaderDescription.value,

                photo: photoURL

            });

            alert("Leader Added!");

        }

        // Reset Form

        leaderName.value = "";
        leaderPosition.value = "";
        leaderDescription.value = "";
        leaderPhoto.value = "";

        await loadLeaders();
        await loadDashboardStats();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveLeader.innerText = "Save Leader";

});
// =========================
// Load Members
// =========================

async function loadMembers() {

    membersList.innerHTML = "";

    const members = await getMembers();

    members.forEach(member => {

    membersList.innerHTML += `

    <div class="card">

        <img
            src="${member.photo}"
            style="
                width:80px;
                height:80px;
                border-radius:50%;
                object-fit:cover;
                margin-bottom:15px;
            ">

        <h3>${member.name}</h3>

        <p><strong>${member.team}</strong></p>

        <p>${member.role}</p>

        <p>${member.uid}</p>

        <div style="margin-top:15px;display:flex;gap:10px;justify-content:center;">

            <button
                class="save-btn editMember"
                data-id="${member.id}">

                Edit

            </button>

            <button
                class="logout-btn deleteMember"
                data-id="${member.id}">

                Delete

            </button>

        </div>

    </div>

    `;

});

}

loadMembers();

// =====================================
// Member Edit & Delete Buttons
// =====================================

membersList.addEventListener("click", async (e) => {

    // --------------------------
    // DELETE
    // --------------------------

    if (e.target.classList.contains("deleteMember")) {

        const id = e.target.dataset.id;

        if (!confirm("Delete this member?")) return;

        await deleteMember(id);

        await loadMembers();

        await loadDashboardStats();

        alert("Member Deleted!");

    }

    // --------------------------
    // EDIT
    // --------------------------

    if (e.target.classList.contains("editMember")) {

        const id = e.target.dataset.id;

        const members = await getMembers();

        const member = members.find(m => m.id === id);

        if (!member) return;

        editingMemberId = id;

        memberName.value = member.name;
        memberRole.value = member.role;
        memberUID.value = member.uid;
        memberTeam.value = member.team;

        saveMember.innerText = "Update Member";

    }

});

saveMember.addEventListener("click", async () => {

    if (

        memberName.value.trim() === "" ||

        memberRole.value.trim() === "" ||

        memberUID.value.trim() === ""

    ) {

        alert("Please fill all required fields.");

        return;

    }

    saveMember.innerText = "Saving...";

    try {

        let photoURL = "";

        // Upload new image if selected

        if (memberPhoto.files.length > 0) {

            photoURL = await uploadImage(

                memberPhoto.files[0]

            );

        }

        // ===========================
        // UPDATE MEMBER
        // ===========================

        if (editingMemberId) {

            const members = await getMembers();

            const oldMember = members.find(

                m => m.id === editingMemberId

            );

            await updateMember(editingMemberId, {

                name: memberName.value,

                role: memberRole.value,

                uid: memberUID.value,

                team: memberTeam.value,

                photo: photoURL || oldMember.photo

            });

            alert("Member Updated!");

            editingMemberId = null;

            saveMember.innerText = "Save Member";

        }

        // ===========================
        // ADD MEMBER
        // ===========================

        else {

            if (!photoURL && memberPhoto.files.length === 0) {

                alert("Please select a photo.");

                saveMember.innerText = "Save Member";

                return;

            }

            await addMember({

                name: memberName.value,

                role: memberRole.value,

                uid: memberUID.value,

                team: memberTeam.value,

                photo: photoURL

            });

            alert("Member Added!");

        }

        // Reset Form

        memberName.value = "";
        memberRole.value = "";
        memberUID.value = "";
        memberTeam.value = "Rover";
        memberPhoto.value = "";

        await loadMembers();
        await loadDashboardStats();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveMember.innerText = "Save Member";

});
// =========================
// Load Gallery
// =========================

async function loadGallery() {

    galleryList.innerHTML = "";

    const images = await getGallery();

    images.forEach(image => {

     galleryList.innerHTML += `

<div class="card">

    <img
        src="${image.image}"
        style="
            width:100%;
            height:180px;
            object-fit:cover;
            border-radius:10px;
            margin-bottom:15px;
        ">

    <h3>${image.title}</h3>

    <div style="margin-top:15px;display:flex;gap:10px;justify-content:center;">

        <button
            class="save-btn editGallery"
            data-id="${image.id}">

            Edit

        </button>

        <button
            class="logout-btn deleteGallery"
            data-id="${image.id}">

            Delete

        </button>

    </div>

</div>

`;
    });

}



// =========================
// Save Gallery
// =========================

saveGallery.addEventListener("click", async () => {

    if (galleryTitle.value.trim() === "") {

        alert("Enter image title.");

        return;

    }

    saveGallery.innerText = "Uploading...";

    try {

        let imageURL = "";

        if (galleryImage.files.length > 0) {

            imageURL = await uploadImage(

                galleryImage.files[0]

            );

        }

        // UPDATE

        if (editingGalleryId) {

            const gallery = await getGallery();

            const oldImage = gallery.find(

                img => img.id === editingGalleryId

            );

            await updateGallery(editingGalleryId, {

                title: galleryTitle.value,

                image: imageURL || oldImage.image

            });

            editingGalleryId = null;

            alert("Gallery Updated!");

        }

        // ADD

        else {

            if (!imageURL) {

                alert("Please choose an image.");

                return;

            }

            await addGallery({

                title: galleryTitle.value,

                image: imageURL

            });

            alert("Image Uploaded!");

        }

        galleryTitle.value = "";

        galleryImage.value = "";

        saveGallery.innerText = "Upload Image";

        await loadGallery();

        await loadDashboardStats();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

});

async function loadAboutData() {

    try {

        const data = await loadAbout();

        if (!data) return;

        aboutTitle.value = data.title || "";
        aboutSubtitle.value = data.subtitle || "";
        whoWeAre.value = data.whoWeAre || "";
        ourMotto.value = data.motto || "";
        missionText.value = data.mission || "";
        visionText.value = data.vision || "";
        valuesText.value = data.values || "";

    }

    catch (error) {

        console.error(error);

    }

}

loadAboutData();


// =========================
// Save About
// =========================

saveAboutBtn.addEventListener("click", async () => {

    saveAboutBtn.innerText = "Saving...";

    try {

        await saveAbout({

            title: aboutTitle.value,

            whoWeAre: whoWeAre.value,

            subtitle: aboutSubtitle.value,

            motto: ourMotto.value,

            mission: missionText.value,

            vision: visionText.value,

            values: valuesText.value

        });

        alert("About Section Saved Successfully!");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveAboutBtn.innerText = "Save About";

});
// =========================
// Load Contact
// =========================

async function loadContactData() {

    try {

        const data = await loadContact();

        if (!data) return;

        contactAddress.value = data.address || "";
        contactEmail.value = data.email || "";
        contactPhone.value = data.phone || "";

    }

    catch (error) {

        console.error(error);

    }

}

loadContactData();


// =========================
// Save Contact
// =========================

saveContactBtn.addEventListener("click", async () => {

    saveContactBtn.innerText = "Saving...";

    try {

        await saveContact({

            address: contactAddress.value,

            email: contactEmail.value,

            phone: contactPhone.value

        });

        alert("Contact Saved Successfully!");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveContactBtn.innerText = "Save Contact";

});
// =====================================
// Dashboard Statistics
// =====================================

async function loadDashboardStats() {

    const leaders =
        await getDocs(collection(db, "leaders"));

    const members =
        await getDocs(collection(db, "members"));

    const gallery =
        await getDocs(collection(db, "gallery"));

    const events =
        await getDocs(collection(db, "events"));

    leaderCount.textContent = leaders.size;
    memberCount.textContent = members.size;
    galleryCount.textContent = gallery.size;
    eventCount.textContent = events.size;

}
loadDashboardStats();
// =====================================
// Logout
// =====================================

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "../index.html";

    }

    catch (error) {

        alert(error.message);

    }

});
// =====================================
// LOAD EVENTS
// =====================================

async function loadEvents() {

    eventsList.innerHTML = "";

    const events = await getEvents();

    events.forEach(event => {

        eventsList.innerHTML += `

        <div class="card">

            <img
                src="${event.poster}"
                style="
                    width:100%;
                    height:180px;
                    object-fit:cover;
                    border-radius:10px;
                    margin-bottom:15px;
                ">

            <h3>${event.title}</h3>

            <p><strong>${event.date}</strong></p>

            <p>${event.venue}</p>

            <p>${event.description}</p>

            <div style="margin-top:15px;display:flex;gap:10px;justify-content:center;">

                <button
                    class="save-btn editEvent"
                    data-id="${event.id}">

                    Edit

                </button>

                <button
                    class="logout-btn deleteEvent"
                    data-id="${event.id}">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

loadEvents();


// =====================================
// EDIT & DELETE EVENTS
// =====================================

eventsList.addEventListener("click", async (e) => {

    // DELETE

    if (e.target.classList.contains("deleteEvent")) {

        const id = e.target.dataset.id;

        if (!confirm("Delete this event?")) return;

        await deleteEvent(id);

        await loadEvents();

        await loadDashboardStats();

        alert("Event Deleted!");

    }

    // EDIT

    if (e.target.classList.contains("editEvent")) {

        const id = e.target.dataset.id;

        const events = await getEvents();

        const event = events.find(ev => ev.id === id);

        if (!event) return;

        editingEventId = id;

        eventTitle.value = event.title;
        eventDate.value = event.date;
        eventVenue.value = event.venue;
        eventDescription.value = event.description;

        saveEvent.innerText = "Update Event";

    }

});


// =====================================
// SAVE EVENT
// =====================================

saveEvent.addEventListener("click", async () => {

    if (

        eventTitle.value.trim() === "" ||

        eventDate.value.trim() === "" ||

        eventVenue.value.trim() === ""

    ) {

        alert("Please fill all required fields.");

        return;

    }

    saveEvent.innerText = "Saving...";

    try {

        let posterURL = "";

        if (eventPoster.files.length > 0) {

            posterURL = await uploadImage(

                eventPoster.files[0]

            );

        }

        // UPDATE

        if (editingEventId) {

            const events = await getEvents();

            const oldEvent = events.find(

                e => e.id === editingEventId

            );

            await updateEvent(editingEventId, {

                title: eventTitle.value,

                date: eventDate.value,

                venue: eventVenue.value,

                description: eventDescription.value,

                poster: posterURL || oldEvent.poster

            });

            editingEventId = null;

            alert("Event Updated!");

        }

        // ADD

        else {

            if (!posterURL) {

                alert("Please upload a poster.");

                saveEvent.innerText = "Save Event";

                return;

            }

            await addEvent({

                title: eventTitle.value,

                date: eventDate.value,

                venue: eventVenue.value,

                description: eventDescription.value,

                poster: posterURL

            });

            alert("Event Added!");

        }

        eventTitle.value = "";
        eventDate.value = "";
        eventVenue.value = "";
        eventDescription.value = "";
        eventPoster.value = "";

        saveEvent.innerText = "Save Event";

        await loadEvents();

        await loadDashboardStats();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

});
// =====================================
// LOAD GALLERY
// =====================================


loadGallery();
// =====================================
// EDIT & DELETE GALLERY
// =====================================

galleryList.addEventListener("click", async (e) => {

    // Delete

    if (e.target.classList.contains("deleteGallery")) {

        const id = e.target.dataset.id;

        if (!confirm("Delete this image?")) return;

        await deleteGallery(id);

        await loadGallery();

        await loadDashboardStats();

    }

    // Edit

    if (e.target.classList.contains("editGallery")) {

        const id = e.target.dataset.id;

        const gallery = await getGallery();

        const image = gallery.find(img => img.id === id);

        if (!image) return;

        editingGalleryId = id;

        galleryTitle.value = image.title;

        saveGallery.innerText = "Update Image";

    }

});