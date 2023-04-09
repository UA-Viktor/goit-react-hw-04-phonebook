import { useState, useEffect } from 'react';

// import { nanoid } from 'nanoid';
// import { Notify } from 'notiflix';

import Modal from './Modal/Modal';
import Section from './Section/Section';
import Form from './Form/Form';
// import ContactForm from './Form/FormFormik';
import Contacts from './Contacts/Contacts';
import Filter from './Filter/Filter';

import IconButton from './IconButton/IconButton';
import { ReactComponent as AddIcon } from '../icons/add.svg';

const defaultContacts = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];

export default function App() {
  const [contacts, setContacts] = useState(defaultContacts);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(prevModal => !prevModal);
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value.trim());
  };

  // const getVisibleContacts = () => {
  //   return contacts.filter(contact =>
  //     contact.name.toLowerCase().includes(filter.toLowerCase())
  //   );
  // };
  // const visibleContacts = getVisibleContacts();

  const filterValueLowerCase = filter?.toLowerCase();

  const visibleContacts = contacts.filter(contact => {
    return contact.name?.toLowerCase().includes(filterValueLowerCase);
  });

  const deleteContact = todoId => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== todoId)
    );
  };

  // const formSubmitHandler = data => {
  //   const dataWithId = {
  //     ...data,
  //     id: nanoid(5),
  //   };
  //   if (contacts.some(contact => contact.name === dataWithId.name)) {
  //     Notify.failure(`${dataWithId.name} is already in contacts.`);
  //     return;
  //   }
  //   setContacts(prevState => ({ ...prevState, dataWithId }));
  // };

  const newContactAudit = newContact => {
    return contacts.filter(
      contact => contact.name?.toLowerCase() === newContact.name?.toLowerCase()
    );
  };

  const formSubmitHandler = newContact => {
    if (newContactAudit(newContact).length > 0) {
      alert(`${newContact.name} is already in contacts.`);
      return false;
    } else {
      setContacts(prevContacts => [...prevContacts, newContact]);
      return true;
    }
  };

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    if (showModal) toggleModal();
  }, [contacts]);

  return (
    <>
      <Section
        text="Add Contact"
        childComponent={
          <IconButton onClick={toggleModal} aria-label="Добавить todo">
            <AddIcon width="40" height="40" fill="#3f6884" />
          </IconButton>
        }
      />

      {showModal && (
        <Modal onClose={toggleModal}>
          <Section
            text="Phonebook"
            childComponent={<Form onSubmit={formSubmitHandler} />}
            // childComponent={<ContactForm onSubmit={formSubmitHandler} />}
          />
        </Modal>
      )}

      <Section
        text="Contacts"
        childComponentFilter={<Filter value={filter} onChange={changeFilter} />}
        childComponent={
          <Contacts
            contacts={visibleContacts}
            onDeleteContact={deleteContact}
          />
        }
      />
    </>
  );
}
