#usage - python encrypt.py

import hashlib
import base64
import rsa


## HASHING
print(f"\n-----BEGIN HASHING-----")
code1 = 'John Doe'
hash1 = hashlib.sha256(code1.encode('utf-8'))
print(f"First sha256 hash (John Doe) as hexadecimal: {hash1.hexdigest()}")
print(f"First sha256 hash (John Doe) as base64: {base64.b64encode(hash1.digest())}")

code2 = 'John doe'
hash2 = hashlib.sha256(code2.encode('utf-8')).digest()
print(f"Second sha256 hash (John doe): {base64.b64encode(hash2)}")

print(f"-----END HASHING-----\n")

print(f"\n-----BEGIN ASYMMETRIC ENCRYPTION-----\n")


# Rivest, Shamir, and Adleman (RSA algorithm)
# Each pair of the RSA algorithm has two keys, i.e. a public key and a private key. One key is used for encrypting the
# message which can only be decrypted by the other key. For instance, let’s say we have two peers communicating with
# each other in a channel secured by the RSA algorithm. The sender will encrypt the plain text with the recipient’s
# public key. This is so that the receiver is the only one who can decrypt the message using their private key.

publicKey, privateKey = rsa.newkeys(2048)
print(f"Public key: {publicKey.save_pkcs1('PEM')}")
print(f"\nPrivate key: {privateKey.save_pkcs1('PEM')}\n")

# PEM (originally “Privacy Enhanced Mail”) is the most common format for X. 509 certificates, CSRs, and cryptographic
# keys. A PEM file is a text file containing one or more items in Base64 ASCII encoding, each with plain-text headers
# and footers (e.g. -----BEGIN CERTIFICATE----- and -----END CERTIFICATE----- )

# message = input('Enter message to encrypt then press enter:')
message = 'Welcome to UCT FinTech 2021'
ciphertext = rsa.encrypt(message.encode('ascii'), publicKey)
print(f'Cipher text: {base64.b64encode(ciphertext)}')

text = rsa.decrypt(ciphertext, privateKey).decode('ascii')
print(f'Message text: {text}')

print(f"-----END ASYMMETRIC ENCRYPTION-----\n")



