import { useState, useEffect } from 'react';

import { nanoid } from 'nanoid';
import { Notify } from 'notiflix';

import Modal from './Modal/Modal';
import Section from './Section/Section';
// import Form from './Form/Form';
import ContactForm from './Form/FormFormik';
import Contacts from './Contacts/Contacts';
import Filter from './Filter/Filter';

import IconButton from './IconButton/IconButton';
import { ReactComponent as AddIcon } from '../icons/add.svg';

export default function App() {
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(localStorage.getItem('contacts')) ?? [];
  });
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(prevModal => !prevModal);
  };

  const deleteContact = contactId => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const getVisibleContacts = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const formSubmitHandler = data => {
    const dataWithId = {
      ...data,
      id: nanoid(5),
    };

    if (contacts.some(contact => contact.name === dataWithId.name)) {
      Notify.failure(`${dataWithId.name} is already in contacts.`);
      return;
    }

    setContacts(prevState => ({ ...prevState, dataWithId }));
  };

  useEffect(() => {
    setContacts(localStorage.setItem('contacts', JSON.stringify(contacts)));
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
            // childComponent={<Form onSubmit={this.formSubmitHandler} />}
            childComponent={<ContactForm onSubmit={formSubmitHandler} />}
          />
        </Modal>
      )}

      <Section
        text="Contacts"
        childComponentFilter={<Filter value={filter} onChange={changeFilter} />}
        childComponent={
          <Contacts
            contacts={getVisibleContacts}
            onDeleteContact={deleteContact}
          />
        }
      />
    </>
  );
}
