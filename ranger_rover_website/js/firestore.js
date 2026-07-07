import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ===========================================
// WEBSITE SETTINGS
// ===========================================

const websiteRef = doc(db, "website", "settings");

export async function loadWebsiteSettings() {

    const snap = await getDoc(websiteRef);

    if (snap.exists()) {

        return snap.data();

    }

    return null;

}

export async function saveWebsiteSettings(data) {

    await setDoc(
        websiteRef,
        data,
        { merge: true }
    );

}

// ===========================================
// LEADERS COLLECTION
// ===========================================

const leadersCollection = collection(db, "leaders");

// Add Leader

export async function addLeader(data) {

    await addDoc(leadersCollection, data);

}

// Get Leaders

export async function getLeaders() {

    const snapshot = await getDocs(leadersCollection);

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

// Update Leader

export async function updateLeader(id, data) {

    await updateDoc(

        doc(db, "leaders", id),

        data

    );

}

// Delete Leader

export async function deleteLeader(id) {

    await deleteDoc(

        doc(db, "leaders", id)

    );

}

// ===========================================
// MEMBERS COLLECTION
// ===========================================

const membersCollection = collection(db, "members");

// Add Member

export async function addMember(data) {

    await addDoc(membersCollection, data);

}

// Get Members

export async function getMembers() {

    const snapshot = await getDocs(membersCollection);

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

// Update Member

export async function updateMember(id, data) {

    await updateDoc(

        doc(db, "members", id),

        data

    );

}

// Delete Member

export async function deleteMember(id) {

    await deleteDoc(

        doc(db, "members", id)

    );

}

// ===========================================
// GALLERY COLLECTION
// ===========================================

const galleryCollection = collection(db, "gallery");

// Add Image

export async function addGallery(data) {

    await addDoc(galleryCollection, data);

}

// Get Images

export async function getGallery() {

    const snapshot = await getDocs(galleryCollection);

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}
export async function updateGallery(id, data) {

    await updateDoc(

        doc(db, "gallery", id),

        data

    );

}

// Delete Gallery

export async function deleteGallery(id) {

    await deleteDoc(

        doc(db, "gallery", id)

    );

}
// ===========================================
// ABOUT
// ===========================================

const aboutRef = doc(db, "about", "content");

export async function loadAbout() {

    const snap = await getDoc(aboutRef);

    if (snap.exists()) {

        return snap.data();

    }

    return null;

}

export async function saveAbout(data) {

    await setDoc(

        aboutRef,

        data,

        { merge: true }

    );

}

// ===========================================
// CONTACT
// ===========================================

const contactRef = doc(db, "contact", "details");

export async function loadContact() {

    const snap = await getDoc(contactRef);

    if (snap.exists()) {

        return snap.data();

    }

    return null;

}

export async function saveContact(data) {

    await setDoc(

        contactRef,

        data,

        { merge: true }

    );

}
// ===========================================
// EVENTS COLLECTION
// ===========================================

const eventsCollection = collection(db, "events");

// Add Event

export async function addEvent(data) {

    await addDoc(eventsCollection, data);

}

// Get Events

export async function getEvents() {

    const snapshot = await getDocs(eventsCollection);

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}

// Update Event

export async function updateEvent(id, data) {

    await updateDoc(

        doc(db, "events", id),

        data

    );

}

// Delete Event

export async function deleteEvent(id) {

    await deleteDoc(

        doc(db, "events", id)

    );

}