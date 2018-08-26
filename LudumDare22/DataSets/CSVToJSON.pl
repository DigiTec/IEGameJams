
my $hasHeaders = 0;
my $jsonP = 0;
my $csvFile;

my @headers = (
    "field1",
    "field2",
    "field3",
    "field4",
    "field5",
    "field6",
    "field7",
    "field8",
    "field9",
    "field10"
);

while (scalar(@ARGV) > 0)
{
    my $arg = shift @ARGV;
    if ( $arg =~ /^\-headers$/ )
    {
        $hasHeaders = 1;
    }
    elsif ( $arg =~ /^\-jsonp$/ )
    {
        $jsonP = 1;
    }
    else
    {
        $csvFile = $arg;
    }
}

open IN, "<$csvFile";
if ( $jsonP == 1 )
{
    print "var \@data = [\n";
}
else
{
    print "[\n";
}
while(<IN>)
{
    chomp;
    if ( $hasHeaders == 1 )
    {
        @headers = split(/,/, $_);
        $hasHeaders = 0;
    }
    else
    {
        my $header = 0;
        my @values = split(/,/, $_);
        print "{\n";
        for my $value (@values)
        {
            print "\t\"$headers[$header]\": \"$value\"\n";
            $header++;
        }
        print "},\n";
    }
}
if ( $jsonP == 1 )
{
    print "];\n";
}
else
{
    print "]\n";
}
close IN;