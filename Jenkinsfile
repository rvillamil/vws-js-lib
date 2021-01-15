pipeline {
    agent {
        docker {
            image 'node:14-alpine' 
            args '-p 3000:3000' 
        }
    }
    environment {
        HOME = '.'
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }

        stage('Software Composition Analysis (SCA)') {
            steps {                 
                 sh 'npm install -g @cyclonedx/bom'
                 sh 'cyclonedx-bom -o bom.xml'
            }            
        }

        // dependencyTrackPublisher artifact: 'devsecops-java-sandbox', autoCreateProjects: false, dependencyTrackApiKey: '', dependencyTrackUrl: '', projectId: '2d6fc921-8dd7-4c3d-9279-eb747a1fb6e1', synchronous: false
        stage('Dependency Track Publisher') {
            steps {
                withCredentials([string(credentialsId: 'mydependencytrack-api-key', variable: 'API_KEY')]) {
                    dependencyTrackPublisher dependencyTrackUrl: 'http://mydependencytrack-devsecops-rvp-local:8081', 
                                             artifact: 'bom.xml', 
                                             projectName: "vws-js-lib", 
                                             projectVersion: "4.0.2", 
                                             synchronous: true, 
                                             dependencyTrackApiKey: API_KEY
                }
            }
        }
    }
}