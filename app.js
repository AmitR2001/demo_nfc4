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
        ${fullName || 'N/A'},${age || 'N/A'},${gender || 'N/A'},${bloodType || 'N/A'},
        ${drugAllergies || 'N/A'},${foodAllergies || 'N/A'},${environmentalAllergies || 'N/A'},
        ${diabetes || 'N/A'},${hypertension || 'N/A'},${asthma || 'N/A'},${heartDisease || 'N/A'},${kidneyDisease || 'N/A'},
        ${currentMedications || 'N/A'},${medicationChanges || 'N/A'},
        ${surgeries || 'N/A'},${illnesses || 'N/A'},
        ${emergencyContactName || 'N/A'},${emergencyContactRelationship || 'N/A'},${emergencyContactPhone || 'N/A'},
        ${tetanus || 'N/A'},${covid19 || 'N/A'},${otherImmunizations || 'N/A'},
        ${smoker || 'N/A'},${alcohol || 'N/A'},${dietaryRestrictions || 'N/A'},
        ${physicianName || 'N/A'},${physicianContact || 'N/A'},
        ${insuranceProvider || 'N/A'},${insurancePolicy || 'N/A'}
    `;

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

document.getElementById('readNFCButton').addEventListener('click', async function handleClick() {
    if ('NDEFReader' in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = event => {
                const decoder = new TextDecoder();
                let nfcData = '';
                for (const record of event.message.records) {
                    nfcData += decoder.decode(record.data);
                }
                displayNFCData(nfcData);
                // Remove the event listener after the first scan
                document.getElementById('readNFCButton').removeEventListener('click', handleClick);
            };
        } catch (error) {
            document.getElementById('message').textContent = `Error: ${error}`;
            document.getElementById('message').classList.add('alert', 'alert-danger');
        }
    } else {
        document.getElementById('message').textContent = 'Web NFC is not supported on this device.';
        document.getElementById('message').classList.add('alert', 'alert-danger');
    }
});

// Function to display NFC data in a new window
function displayNFCData(data) {
    const fieldLabels = [
        "Full Name", "Age", "Gender", "Blood Type",
        "Drug Allergies", "Food Allergies", "Environmental Allergies",
        "Diabetes", "Hypertension", "Asthma", "Heart Disease", "Kidney Disease",
        "Current Medications", "Medication Changes",
        "Surgeries", "Illnesses",
        "Emergency Contact Name", "Emergency Contact Relationship", "Emergency Contact Phone",
        "Tetanus", "COVID-19", "Other Immunizations",
        "Smoker", "Alcohol", "Dietary Restrictions",
        "Physician Name", "Physician Contact",
        "Insurance Provider", "Insurance Policy"
    ];

    const values = data.split(',');
    let content = '<html><head><title>NFC Data</title><style>';
    content += 'body { font-family: Arial, sans-serif; margin: 20px; font-size: 20px; }';
    content += 'h1 { text-align: center; font-size: 50px; }';
    content += 'table { width: 100%; border-collapse: collapse; margin-top: 20px; }';
    content += 'th, td { padding: 8px; border: 1px solid #ddd; text-align: left; font-size: 30px; }';
    content += 'th { background-color: #f2f2f2; }';
    content += '@media (max-width: 600px) {';
    content += 'body { font-size: 18px; }';
    content += 'h1 { font-size: 22px; }';
    content += 'th, td { font-size: 16px; padding: 6px; }';
    content += 'table { width: 100%; }';
    content += '}';
    content += '</style></head><body>';
    content += '<h1>NFC Tag Data</h1>';
    content += '<table>';
    content += '<tr><th>Field</th><th>Value</th></tr>';
    values.forEach((value, index) => {
        content += `<tr><td>${fieldLabels[index]}</td><td>${value.trim() || 'N/A'}</td></tr>`;
    });

    content += '</table></body></html>';

    const newWindow = window.open();
    newWindow.document.write(content);
    newWindow.document.close();
}

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
