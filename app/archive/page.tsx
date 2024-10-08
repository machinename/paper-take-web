'use client'

import styles from "../page.module.css";
import NoteGUI from "../components/NoteGUI";
import { useAppContext } from "../providers/AppProvider";

export default function Archive() {
    const { notes } = useAppContext();
    const archivedNotes = notes.filter(note => note.isArchived && !note.isTrash);

    return (
        <div className={styles.page}>
            {archivedNotes.length === 0 ? (
                <div className={styles.pageTitle}>
                    <p>Empty Archive</p>
                </div>
            ) : (
                archivedNotes.map(note => (
                    <NoteGUI note={note} operation='read' key={note.id} />
                ))
            )}
        </div>
    );
}