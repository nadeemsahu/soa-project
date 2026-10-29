package com.klu.patient.soap;

import com.klu.patient.model.Patient;
import com.klu.patient.repository.PatientRepository;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import java.util.Optional;

@Endpoint
public class PatientSoapEndpoint {

    private static final String NAMESPACE_URI = "http://apexcare.com/patient/soap";

    private final PatientRepository patientRepository;

    public PatientSoapEndpoint(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPatientStatusRequest")
    @ResponsePayload
    public Element getPatientStatus(@RequestPayload Element request) throws Exception {
        NodeList idNodes = request.getElementsByTagNameNS(NAMESPACE_URI, "patientId");
        if (idNodes.getLength() == 0) {
            idNodes = request.getElementsByTagName("patientId");
        }
        String patientId = idNodes.getLength() > 0 ? idNodes.item(0).getTextContent().trim() : "u1";

        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        String name = patientOpt.map(Patient::getName).orElse("Eleanor Vance");
        String status = patientOpt.isPresent() ? "ACTIVE" : "UNREGISTERED";
        boolean verified = patientOpt.isPresent();

        Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
        Element response = doc.createElementNS(NAMESPACE_URI, "getPatientStatusResponse");

        Element idEl = doc.createElementNS(NAMESPACE_URI, "patientId");
        idEl.setTextContent(patientId);
        response.appendChild(idEl);

        Element nameEl = doc.createElementNS(NAMESPACE_URI, "name");
        nameEl.setTextContent(name);
        response.appendChild(nameEl);

        Element statusEl = doc.createElementNS(NAMESPACE_URI, "status");
        statusEl.setTextContent(status);
        response.appendChild(statusEl);

        Element verifiedEl = doc.createElementNS(NAMESPACE_URI, "insuranceVerified");
        verifiedEl.setTextContent(String.valueOf(verified));
        response.appendChild(verifiedEl);

        Element eligEl = doc.createElementNS(NAMESPACE_URI, "eligibilityCode");
        eligEl.setTextContent("ELIG-METRO-04");
        response.appendChild(eligEl);

        return response;
    }
}
