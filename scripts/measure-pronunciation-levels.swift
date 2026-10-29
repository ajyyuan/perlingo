// Offline native MP3 decoder. Run via the precompute script, never in the app.
import Foundation
import AVFoundation
import Accelerate
let paths = try JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1]))) as! [String]
let output = URL(fileURLWithPath: CommandLine.arguments[2])
if !FileManager.default.fileExists(atPath: output.path) { FileManager.default.createFile(atPath: output.path, contents: nil) }
let handle = try FileHandle(forWritingTo: output); handle.seekToEndOfFile()
let lock = NSLock(); let queue = OperationQueue(); queue.maxConcurrentOperationCount = 4
var completed = 0; var failed = 0
for path in paths { queue.addOperation { autoreleasepool {
 do {
  let file = try AVAudioFile(forReading: URL(fileURLWithPath: path), commonFormat: .pcmFormatFloat32, interleaved: false)
  guard let pcm = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: AVAudioFrameCount(file.length)) else { throw NSError(domain:"PCM",code:1) }
  try file.read(into: pcm)
  guard let channels = pcm.floatChannelData, pcm.frameLength > 0 else { throw NSError(domain:"PCM",code:2) }
  let width = max(1,Int((pcm.format.sampleRate * 0.02).rounded())), count = Int(pcm.frameLength), channelCount = Int(pcm.format.channelCount)
  var powers = [Double]()
  for start in stride(from:0,to:count,by:width) {
   let n = min(width,count-start); var sum = 0.0
   for c in 0..<channelCount { var value:Float = 0; vDSP_svesq(channels[c].advanced(by:start),1,&value,vDSP_Length(n)); sum += Double(value) }
   powers.append(sum / Double(n * channelCount))
  }
  let gate = (powers.max() ?? 0) * 0.0001, active = powers.filter { $0 > gate }
  let rms = active.isEmpty ? 0 : sqrt(active.reduce(0,+) / Double(active.count))
  let db = 20 * log10(max(rms,1e-9))
  let data = try JSONSerialization.data(withJSONObject:[path,db])
  lock.lock(); handle.write(data); handle.write(Data([10])); completed += 1
  if completed % 10000 == 0 { print("Measured \(completed) / \(paths.count)"); fflush(stdout) }; lock.unlock()
 } catch { lock.lock(); failed += 1; fputs("Decode failed: \(path)\n",stderr); lock.unlock() }
} } }
queue.waitUntilAllOperationsAreFinished(); try handle.close()
print("Measured \(completed); failures \(failed)")
if failed > 0 { exit(1) }
