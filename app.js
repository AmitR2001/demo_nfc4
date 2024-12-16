// latest code
document.getElementById('writeButton').addEventListener('click', async () => {
    const fullName = document.getElementById('fullName').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const bloodType = document.getElementById('bloodType').value;
    const drugAllergies = document.getElementById('drugAllergies').value;
    const foodAllergies = document.getElementById('foodAllergies').value;
    const environmentalAllergies = document.getElementById('environmentalAllergies').value;
    const diabetes = document.getElementById('diabetes').value;
    const hypertension = document.getElementById('hypertension').value;
    const asthma = document.getElementById('asthma').value;
    const heartDisease = document.getElementById('heartDisease').value;
    const kidneyDisease = document.getElementById('kidneyDisease').value;
    const currentMedications = document.getElementById('currentMedications').value;
    const medicationChanges = document.getElementById('medicationChanges').value;
    const surgeries = document.getElementById('surgeries').value;
    const illnesses = document.getElementById('illnesses').value;
    const emergencyContactName = document.getElementById('emergencyContactName').value;
    const emergencyContactRelationship = document.getElementById('emergencyContactRelationship').value;
    const emergencyContactPhone = document.getElementById('emergencyContactPhone').value;
    const tetanus = document.getElementById('tetanus').value;
    const covid19 = document.getElementById('covid19').value;
    const otherImmunizations = document.getElementById('otherImmunizations').value;
    const smoker = document.getElementById('smoker').value;
    const alcohol = document.getElementById('alcohol').value;
    const dietaryRestrictions = document.getElementById('dietaryRestrictions').value;
    const physicianName = document.getElementById('physicianName').value;
    const physicianContact = document.getElementById('physicianContact').value;
    const insuranceProvider = document.getElementById('insuranceProvider').value;
    const insurancePolicy = document.getElementById('insurancePolicy').value;

    const message = `
        1.PI|FN:${fullName}|A:${age}|G:${gender}|BT:${bloodType}
        2.AL|D:${drugAllergies}|F:${foodAllergies}|E:${environmentalAllergies}
        3.CC|D:${diabetes}|H:${hypertension}|A:${asthma}|HD:${heartDisease}|KD:${kidneyDisease}
        4.MED|C:${currentMedications}|CH:${medicationChanges}
        5.PMH|S:${surgeries}|I:${illnesses}
        6.EC|N:${emergencyContactName}|R:${emergencyContactRelationship}|P:${emergencyContactPhone}
        7.IMM|T:${tetanus}|C:${covid19}|O:${otherImmunizations}
        8.LF|S:${smoker}|A:${alcohol}|DR:${dietaryRestrictions}
        9.PHY|N:${physicianName}|C:${physicianContact}
        10.INS|P:${insuranceProvider}|PN:${insurancePolicy}
    `.trim();

    if ('NDEFReader' in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.write(message).then(() => {
                document.getElementById('message').textContent = 'Message written.';
            }).catch(error => {
                document.getElementById('message').textContent = `Write failed :-( try again: ${error}.`;
            });
        } catch (error) {
            document.getElementById('message').textContent = `Error: ${error}`;
        }
    } else {
        document.getElementById('message').textContent = 'Web NFC is not supported on this device.';
    }
});

document.getElementById('readButton').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    const data = decoder.decode(record.data);
                    const parsedData = parseNFCData(data);
                    const newWindow = window.open();
                    newWindow.document.write(`
                        <html>
                        <head>
                            <title>Emergency Details</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 20px;
                                }
                                .container {
                                    background-color: #fff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    text-align: center;
                                    color: #333;
                                }
                                p {
                                    color: #333;
                                }
                                a {
                                    color: #007bff;
                                    text-decoration: none;
                                }
                                a:hover {
                                    text-decoration: underline;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Emergency Details</h1>
                                ${parsedData}
                                <p><a href="tel:${document.getElementById('physicianContact').value}">Call Physician</a></p>
                                <p><a href="tel:${document.getElementById('emergencyContactPhone').value}">Call Emergency Contact</a></p>
                            </div>
                        </body>
                        </html>
                    `);
                }
            };
        } catch (error) {
            document.getElementById('message').textContent = `Error: ${error}`;
        }
    } else {
        document.getElementById('message').textContent = 'Web NFC is not supported on this device.';
    }
});

function parseNFCData(data) {
    const lines = data.split('\n');
    let parsedData = '';
    lines.forEach(line => {
        const [section, details] = line.split('|');
        switch (section) {
            case '1.PI':
                parsedData += `<p><strong>Full Name:</strong> ${details.match(/FN:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Age:</strong> ${details.match(/A:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Gender:</strong> ${details.match(/G:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Blood Type:</strong> ${details.match(/BT:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '2.AL':
                parsedData += `<p><strong>Drug Allergies:</strong> ${details.match(/D:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Food Allergies:</strong> ${details.match(/F:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Environmental Allergies:</strong> ${details.match(/E:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '3.CC':
                parsedData += `<p><strong>Diabetes:</strong> ${details.match(/D:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Hypertension:</strong> ${details.match(/H:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Asthma:</strong> ${details.match(/A:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Heart Disease:</strong> ${details.match(/HD:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Kidney Disease:</strong> ${details.match(/KD:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '4.MED':
                parsedData += `<p><strong>Current Medications:</strong> ${details.match(/C:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Medication Changes:</strong> ${details.match(/CH:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '5.PMH':
                parsedData += `<p><strong>Surgeries:</strong> ${details.match(/S:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Illnesses:</strong> ${details.match(/I:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '6.EC':
                parsedData += `<p><strong>Emergency Contact Name:</strong> ${details.match(/N:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Relationship:</strong> ${details.match(/R:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Phone:</strong> ${details.match(/P:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '7.IMM':
                parsedData += `<p><strong>Tetanus:</strong> ${details.match(/T:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>COVID-19:</strong> ${details.match(/C:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Other Immunizations:</strong> ${details.match(/O:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '8.LF':
                parsedData += `<p><strong>Smoker:</strong> ${details.match(/S:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Alcohol:</strong> ${details.match(/A:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Dietary Restrictions:</strong> ${details.match(/DR:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '9.PHY':
                parsedData += `<p><strong>Physician Name:</strong> ${details.match(/N:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Contact:</strong> ${details.match(/C:(.*?)(?=\|)/)[1]}</p>`;
                break;
            case '10.INS':
                parsedData += `<p><strong>Insurance Provider:</strong> ${details.match(/P:(.*?)(?=\|)/)[1]}</p>`;
                parsedData += `<p><strong>Policy Number:</strong> ${details.match(/PN:(.*?)(?=\|)/)[1]}</p>`;
                break;
        }
    });
    return parsedData;
}
