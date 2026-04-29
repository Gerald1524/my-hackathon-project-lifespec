import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { DocumentSections } from '@/types'

Font.register({
  family: 'Cormorant',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2' },
  ],
})

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0D0D0D',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  name: {
    fontFamily: 'Cormorant',
    color: '#C9A84C',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#C9A84C',
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.8,
  },
  sectionText: {
    fontFamily: 'Cormorant',
    color: '#F5EDD6',
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 16,
  },
  declarationContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#C9A84C',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C9A84C',
    paddingVertical: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  declarationText: {
    fontFamily: 'Cormorant',
    color: '#F5EDD6',
    fontSize: 13,
    lineHeight: 1.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  intentionLabel: {
    color: '#C9A84C',
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 8,
  },
  intentionText: {
    fontFamily: 'Cormorant',
    color: '#F5EDD6',
    fontSize: 11,
    lineHeight: 1.7,
  },
})

interface Props {
  document: DocumentSections
}

export function DocumentPDF({ document }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{document.name}</Text>

        {([
          ['whoYouAre', 'Who You Are'],
          ['whereYouAre', 'Where You Are'],
          ['whatIsInTheWay', 'What Is In The Way'],
          ['whatYouAreHereFor', 'What You Are Here For'],
          ['yourNextSteps', 'Your Next Steps'],
        ] as [keyof DocumentSections, string][]).map(([key, label]) => (
          <View key={key}>
            <Text style={styles.sectionLabel}>{label}</Text>
            <Text style={styles.sectionText}>{document[key]}</Text>
          </View>
        ))}

        <View style={styles.declarationContainer}>
          <Text style={styles.sectionLabel}>Your Declaration</Text>
          <Text style={styles.declarationText}>{document.yourDeclaration}</Text>
        </View>

        <Text style={styles.intentionLabel}>Your 7-Day Intention</Text>
        <Text style={styles.intentionText}>{document.sevenDayIntention}</Text>
      </Page>
    </Document>
  )
}
