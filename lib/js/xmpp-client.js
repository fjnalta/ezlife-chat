/* eslint-disable no-console */
const dbHandler = require('./dbHandler');
const chatHander = require('./chatHandler');

// xmpp dependencies
const {
  client,
  xml
} = require('@xmpp/client');
const xmpp = client({
  service: 'xmpp://localhost:5222',
  domain: 'localhost',
  resource: 'ezChat',
  username: 'ajo',
  password: 'asdfg',
});

const contactList = [];

// TODO - debug - accept self signed ssl certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

async function connect() {
  xmpp.start().catch(console.error);
}

async function disconnect() {
  await xmpp.send(xml('presence', {
    type: 'unavailable'
  }));
  await xmpp.stop();
}

function sendMessage(jid, text) {
  let message = xml(
    'message',
    {type: 'chat', to: jid},
    xml('body', null, text)
  );
  xmpp.send(message);
}

// xmpp handler
xmpp.on('error', err => {
  console.error('X', err.toString());
});

xmpp.on('offline', () => {
  console.log('X', 'offline');
});

// incoming xmpp stanza
xmpp.on('stanza', async stanza => {
  if (stanza.is('message') && stanza.getChild('body') != undefined) {
    // process message
    //console.log(stanza.getChild('body'));
    console.log('New Message');
    console.log('To: ', stanza.attrs.to);
    console.log('From: ', stanza.attrs.from);
    console.log('Text: ', stanza.getChild('body').text());

    // TODO - handle db access
  }

  // roster update
  if (stanza.is('iq') && stanza.getChild('query') && stanza.getChild('query').attrs.xmlns == 'jabber:iq:roster') {
    for(var i = 0; i < stanza.children[0].children.length; i++) {
      if(!contactList.includes(stanza.children[0].children[i].attrs)) {
        contactList.push(stanza.children[0].children[i].attrs);
      }
    }
    console.log('Roster Updated: ', contactList);
  }

  // presence update
  if (stanza.is('presence')) {
    console.log('Status change from:', stanza.attrs.from);
    // TODO - handle status change
    if (stanza.attrs.type == undefined) {
      console.log('New Status: ', 'Online');
    } else {
      console.log('New Status: ', stanza.attrs.type);
    }
  }
});

xmpp.on('online', async address => {
  console.log('▶', 'online as', address.toString());
  // mark available
  await xmpp.send(xml('presence'));

  rosterReq = xml('iq',{
    from: address.toString(),
    type: 'get'},
    xml('query',{
      xmlns: 'jabber:iq:roster'})
    );
  // request roster
  await xmpp.send(rosterReq);
});

// Debug Log
xmpp.on('status', status => {
  console.debug('XMPP', 'status', status);
});
//xmpp.on('input', input => {
//  console.debug('⮈', input)
//});
//xmpp.on('output', output => {
//  console.debug('⮊', output);
//});


// exports
module.exports = {
  connect: connect,
  disconnect: disconnect,
  contactList: contactList,
  sendMessage: sendMessage
}