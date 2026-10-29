package com.klu.patient;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@RestController
public class PatientSoapController {

    private final PatientRepository patientRepository;

    public PatientSoapController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping(value = "/ws/patients.wsdl", produces = MediaType.TEXT_XML_VALUE)
    public ResponseEntity<String> getWsdl() {
        String wsdl = """
            <?xml version="1.0" encoding="UTF-8"?>
            <wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
                              xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                              xmlns:tns="http://apexcare.com/patient/soap"
                              targetNamespace="http://apexcare.com/patient/soap">
                <wsdl:types>
                    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
                               targetNamespace="http://apexcare.com/patient/soap"
                               elementFormDefault="qualified">
                        <xs:element name="getPatientStatusRequest">
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="patientId" type="xs:string"/>
                                </xs:sequence>
                            </xs:complexType>
                        </xs:element>
                        <xs:element name="getPatientStatusResponse">
                            <xs:complexType>
                                <xs:sequence>
                                    <xs:element name="patientId" type="xs:string"/>
                                    <xs:element name="name" type="xs:string"/>
                                    <xs:element name="status" type="xs:string"/>
                                    <xs:element name="insuranceVerified" type="xs:boolean"/>
                                    <xs:element name="eligibilityCode" type="xs:string"/>
                                </xs:sequence>
                            </xs:complexType>
                        </xs:element>
                    </xs:schema>
                </wsdl:types>
                <wsdl:message name="getPatientStatusRequest">
                    <wsdl:part name="getPatientStatusRequest" element="tns:getPatientStatusRequest"/>
                </wsdl:message>
                <wsdl:message name="getPatientStatusResponse">
                    <wsdl:part name="getPatientStatusResponse" element="tns:getPatientStatusResponse"/>
                </wsdl:message>
                <wsdl:portType name="PatientsPort">
                    <wsdl:operation name="getPatientStatus">
                        <wsdl:input message="tns:getPatientStatusRequest"/>
                        <wsdl:output message="tns:getPatientStatusResponse"/>
                    </wsdl:operation>
                </wsdl:portType>
                <wsdl:binding name="PatientsPortSoap11" type="tns:PatientsPort">
                    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
                    <wsdl:operation name="getPatientStatus">
                        <soap:operation soapAction=""/>
                        <wsdl:input><soap:body use="literal"/></wsdl:input>
                        <wsdl:output><soap:body use="literal"/></wsdl:output>
                    </wsdl:operation>
                </wsdl:binding>
                <wsdl:service name="PatientsPortService">
                    <wsdl:port name="PatientsPortSoap11" binding="tns:PatientsPortSoap11">
                        <soap:address location="http://localhost:8082/ws"/>
                    </wsdl:port>
                </wsdl:service>
            </wsdl:definitions>
            """;
        return ResponseEntity.ok().contentType(MediaType.TEXT_XML).body(wsdl.trim());
    }

    @PostMapping(value = "/ws", consumes = {MediaType.TEXT_XML_VALUE, MediaType.APPLICATION_XML_VALUE, "application/soap+xml"}, produces = MediaType.TEXT_XML_VALUE)
    public ResponseEntity<String> handleSoapRequest(@RequestBody String xmlBody) {
        String patientId = "u1";
        if (xmlBody.contains("<patientId>")) {
            int start = xmlBody.indexOf("<patientId>") + 11;
            int end = xmlBody.indexOf("</patientId>", start);
            if (end > start) {
                patientId = xmlBody.substring(start, end).trim();
            }
        } else if (xmlBody.contains("<soap:patientId>")) {
            int start = xmlBody.indexOf("<soap:patientId>") + 16;
            int end = xmlBody.indexOf("</soap:patientId>", start);
            if (end > start) {
                patientId = xmlBody.substring(start, end).trim();
            }
        }

        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        String name = patientOpt.map(Patient::getName).orElse("Eleanor Vance");
        String status = patientOpt.isPresent() ? "ACTIVE" : "UNREGISTERED";
        boolean verified = patientOpt.isPresent();

        String responseSoap = String.format("""
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header/>
                <SOAP-ENV:Body>
                    <getPatientStatusResponse xmlns="http://apexcare.com/patient/soap">
                        <patientId>%s</patientId>
                        <name>%s</name>
                        <status>%s</status>
                        <insuranceVerified>%b</insuranceVerified>
                        <eligibilityCode>ELIG-METRO-04</eligibilityCode>
                    </getPatientStatusResponse>
                </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>
            """, patientId, name, status, verified);

        return ResponseEntity.ok().contentType(MediaType.TEXT_XML).body(responseSoap.trim());
    }
}
